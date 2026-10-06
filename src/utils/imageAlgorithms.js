// Core Image Processing Algorithms for Canvas ImageData

export function cloneImageData(ctx, srcData) {
  const dest = ctx.createImageData(srcData.width, srcData.height);
  dest.data.set(srcData.data);
  return dest;
}

export function toGrayscale(imageData) {
  const data = imageData.data;
  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Standard Luminance Formula (Rec. 601)
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }
  return imageData;
}

export function isolateChannel(imageData, channel) {
  // channel: 'r' | 'g' | 'b' | 'all'
  const data = imageData.data;
  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    if (channel === 'r') {
      data[i + 1] = 0;
      data[i + 2] = 0;
    } else if (channel === 'g') {
      data[i] = 0;
      data[i + 2] = 0;
    } else if (channel === 'b') {
      data[i] = 0;
      data[i + 1] = 0;
    }
  }
  return imageData;
}

export function invertImage(imageData) {
  const data = imageData.data;
  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
  return imageData;
}

export function adjustBrightness(imageData, delta) {
  const data = imageData.data;
  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    data[i] = Math.min(255, Math.max(0, data[i] + delta));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + delta));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + delta));
  }
  return imageData;
}

export function adjustContrast(imageData, factor) {
  const data = imageData.data;
  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    data[i] = Math.min(255, Math.max(0, Math.round((data[i] - 128) * factor + 128)));
    data[i + 1] = Math.min(255, Math.max(0, Math.round((data[i + 1] - 128) * factor + 128)));
    data[i + 2] = Math.min(255, Math.max(0, Math.round((data[i + 2] - 128) * factor + 128)));
  }
  return imageData;
}

export function applyThreshold(imageData, threshold) {
  const data = imageData.data;
  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    const val = gray >= threshold ? 255 : 0;
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
  }
  return imageData;
}

export function computeHistogram(imageData) {
  const hist = new Array(256).fill(0);
  const histR = new Array(256).fill(0);
  const histG = new Array(256).fill(0);
  const histB = new Array(256).fill(0);

  const data = imageData.data;
  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    hist[gray]++;
    histR[r]++;
    histG[g]++;
    histB[b]++;
  }
  return { gray: hist, r: histR, g: histG, b: histB, totalPixels: len / 4 };
}

export function equalizeHistogram(imageData) {
  const { gray, totalPixels } = computeHistogram(imageData);
  // Cumulative Distribution Function (CDF)
  const cdf = new Array(256).fill(0);
  let cumulative = 0;
  let cdfMin = 0;
  for (let i = 0; i < 256; i++) {
    cumulative += gray[i];
    cdf[i] = cumulative;
    if (cdfMin === 0 && cumulative > 0) {
      cdfMin = cumulative;
    }
  }

  // Lookup table
  const lut = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    lut[i] = Math.round(((cdf[i] - cdfMin) / (totalPixels - cdfMin)) * 255);
  }

  const data = imageData.data;
  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    data[i] = lut[data[i]];
    data[i + 1] = lut[data[i + 1]];
    data[i + 2] = lut[data[i + 2]];
  }
  return imageData;
}

export function applyConvolution(imageData, kernel, divisor = 1, offset = 0) {
  const w = imageData.width;
  const h = imageData.height;
  const src = new Uint8ClampedArray(imageData.data);
  const dst = imageData.data;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let r = 0, g = 0, b = 0;

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const pixelIdx = ((y + ky) * w + (x + kx)) * 4;
          const kVal = kernel[(ky + 1) * 3 + (kx + 1)];

          r += src[pixelIdx] * kVal;
          g += src[pixelIdx + 1] * kVal;
          b += src[pixelIdx + 2] * kVal;
        }
      }

      const dstIdx = (y * w + x) * 4;
      dst[dstIdx] = Math.min(255, Math.max(0, Math.round(r / divisor) + offset));
      dst[dstIdx + 1] = Math.min(255, Math.max(0, Math.round(g / divisor) + offset));
      dst[dstIdx + 2] = Math.min(255, Math.max(0, Math.round(b / divisor) + offset));
    }
  }
  return imageData;
}

export function addSaltAndPepper(imageData, density = 0.05) {
  const data = imageData.data;
  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    const rand = Math.random();
    if (rand < density / 2) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
    } else if (rand < density) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    }
  }
  return imageData;
}

export function applyMedianFilter(imageData, windowSize = 3) {
  const w = imageData.width;
  const h = imageData.height;
  const src = new Uint8ClampedArray(imageData.data);
  const dst = imageData.data;
  const half = Math.floor(windowSize / 2);

  for (let y = half; y < h - half; y++) {
    for (let x = half; x < w - half; x++) {
      const rVals = [];
      const gVals = [];
      const bVals = [];

      for (let dy = -half; dy <= half; dy++) {
        for (let dx = -half; dx <= half; dx++) {
          const idx = ((y + dy) * w + (x + dx)) * 4;
          rVals.push(src[idx]);
          gVals.push(src[idx + 1]);
          bVals.push(src[idx + 2]);
        }
      }

      rVals.sort((a, b) => a - b);
      gVals.sort((a, b) => a - b);
      bVals.sort((a, b) => a - b);

      const mid = Math.floor(rVals.length / 2);
      const dstIdx = (y * w + x) * 4;
      dst[dstIdx] = rVals[mid];
      dst[dstIdx + 1] = gVals[mid];
      dst[dstIdx + 2] = bVals[mid];
    }
  }
  return imageData;
}

export function applySobel(imageData) {
  toGrayscale(imageData);
  const w = imageData.width;
  const h = imageData.height;
  const src = new Uint8ClampedArray(imageData.data);
  const dst = imageData.data;

  const kx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const ky = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let gx = 0;
      let gy = 0;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const idx = ((y + dy) * w + (x + dx)) * 4;
          const kIdx = (dy + 1) * 3 + (dx + 1);
          const val = src[idx];
          gx += val * kx[kIdx];
          gy += val * ky[kIdx];
        }
      }

      const mag = Math.min(255, Math.round(Math.sqrt(gx * gx + gy * gy)));
      const dstIdx = (y * w + x) * 4;
      dst[dstIdx] = mag;
      dst[dstIdx + 1] = mag;
      dst[dstIdx + 2] = mag;
    }
  }
  return imageData;
}

export function applyCanny(imageData, lowThresh = 30, highThresh = 70) {
  toGrayscale(imageData);
  // Step 1: Smooth with Gaussian Blur 3x3
  const gaussian = [1, 2, 1, 2, 4, 2, 1, 2, 1];
  applyConvolution(imageData, gaussian, 16);

  const w = imageData.width;
  const h = imageData.height;
  const src = new Uint8ClampedArray(imageData.data);
  const dst = imageData.data;

  const magnitude = new Float32Array(w * h);
  const direction = new Float32Array(w * h);

  const kx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const ky = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  // Step 2: Gradients
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let gx = 0;
      let gy = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const idx = ((y + dy) * w + (x + dx)) * 4;
          const kIdx = (dy + 1) * 3 + (dx + 1);
          gx += src[idx] * kx[kIdx];
          gy += src[idx] * ky[kIdx];
        }
      }
      const pos = y * w + x;
      magnitude[pos] = Math.sqrt(gx * gx + gy * gy);
      direction[pos] = Math.atan2(gy, gx) * (180 / Math.PI);
    }
  }

  // Step 3: Non-Maximum Suppression
  const nms = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const pos = y * w + x;
      let angle = direction[pos];
      if (angle < 0) angle += 180;

      const mag = magnitude[pos];
      let p1 = 0, p2 = 0;

      if ((angle >= 0 && angle < 22.5) || (angle >= 157.5 && angle <= 180)) {
        p1 = magnitude[pos - 1];
        p2 = magnitude[pos + 1];
      } else if (angle >= 22.5 && angle < 67.5) {
        p1 = magnitude[(y - 1) * w + (x + 1)];
        p2 = magnitude[(y + 1) * w + (x - 1)];
      } else if (angle >= 67.5 && angle < 112.5) {
        p1 = magnitude[(y - 1) * w + x];
        p2 = magnitude[(y + 1) * w + x];
      } else if (angle >= 112.5 && angle < 157.5) {
        p1 = magnitude[(y - 1) * w + (x - 1)];
        p2 = magnitude[(y + 1) * w + (x + 1)];
      }

      if (mag >= p1 && mag >= p2) {
        nms[pos] = mag;
      } else {
        nms[pos] = 0;
      }
    }
  }

  // Step 4: Double Threshold & Hysteresis
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const pos = y * w + x;
      const val = nms[pos];
      const idx = pos * 4;

      if (val >= highThresh) {
        dst[idx] = 255;
        dst[idx + 1] = 255;
        dst[idx + 2] = 255;
      } else if (val >= lowThresh) {
        // Weak edge: check if any 8-neighbor is strong
        let connected = false;
        for (let ny = -1; ny <= 1; ny++) {
          for (let nx = -1; nx <= 1; nx++) {
            if (nms[(y + ny) * w + (x + nx)] >= highThresh) {
              connected = true;
              break;
            }
          }
          if (connected) break;
        }
        const edgeVal = connected ? 255 : 0;
        dst[idx] = edgeVal;
        dst[idx + 1] = edgeVal;
        dst[idx + 2] = edgeVal;
      } else {
        dst[idx] = 0;
        dst[idx + 1] = 0;
        dst[idx + 2] = 0;
      }
    }
  }
  return imageData;
}

export function applyDilation(imageData, radius = 1) {
  // Binary / Grayscale Dilation (Maximum filter)
  const w = imageData.width;
  const h = imageData.height;
  const src = new Uint8ClampedArray(imageData.data);
  const dst = imageData.data;

  for (let y = radius; y < h - radius; y++) {
    for (let x = radius; x < w - radius; x++) {
      let maxVal = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const idx = ((y + dy) * w + (x + dx)) * 4;
          if (src[idx] > maxVal) maxVal = src[idx];
        }
      }
      const dstIdx = (y * w + x) * 4;
      dst[dstIdx] = maxVal;
      dst[dstIdx + 1] = maxVal;
      dst[dstIdx + 2] = maxVal;
    }
  }
  return imageData;
}

export function applyErosion(imageData, radius = 1) {
  // Binary / Grayscale Erosion (Minimum filter)
  const w = imageData.width;
  const h = imageData.height;
  const src = new Uint8ClampedArray(imageData.data);
  const dst = imageData.data;

  for (let y = radius; y < h - radius; y++) {
    for (let x = radius; x < w - radius; x++) {
      let minVal = 255;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const idx = ((y + dy) * w + (x + dx)) * 4;
          if (src[idx] < minVal) minVal = src[idx];
        }
      }
      const dstIdx = (y * w + x) * 4;
      dst[dstIdx] = minVal;
      dst[dstIdx + 1] = minVal;
      dst[dstIdx + 2] = minVal;
    }
  }
  return imageData;
}

// Generate built-in educational sample canvases (shapes, robot, eye, coin)
export function drawPresetSample(canvas, preset = 'robot') {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  if (preset === 'robot') {
    // Cyber Robot Face with sharp edges and gradients
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(w * 0.15, h * 0.15, w * 0.7, h * 0.7);

    // Antenna
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.15);
    ctx.lineTo(w * 0.5, h * 0.05);
    ctx.stroke();

    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.05, 7, 0, Math.PI * 2);
    ctx.fill();

    // Eyes (Glowing cyan and amber)
    ctx.fillStyle = '#00f2fe';
    ctx.beginPath();
    ctx.arc(w * 0.35, h * 0.4, w * 0.09, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(w * 0.65, h * 0.4, w * 0.09, 0, Math.PI * 2);
    ctx.fill();

    // Mouth grid
    ctx.fillStyle = '#10b981';
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(w * (0.3 + i * 0.08), h * 0.68, w * 0.05, h * 0.08);
    }
  } else if (preset === 'shapes') {
    // High contrast geometric shapes for morphology & edge detection
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(w * 0.3, h * 0.35, w * 0.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(w * 0.55, h * 0.2, w * 0.35, h * 0.35);

    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.6);
    ctx.lineTo(w * 0.2, h * 0.88);
    ctx.lineTo(w * 0.8, h * 0.88);
    ctx.closePath();
    ctx.fill();
  } else if (preset === 'coins') {
    // Medical/Cell or Coins segmentation style
    const centers = [
      [w * 0.25, h * 0.3, 24],
      [w * 0.6, h * 0.25, 20],
      [w * 0.75, h * 0.55, 26],
      [w * 0.35, h * 0.7, 30],
      [w * 0.7, h * 0.8, 18],
    ];
    centers.forEach(([cx, cy, r]) => {
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.7, '#eab308');
      grad.addColorStop(1, '#854d0e');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }
}
