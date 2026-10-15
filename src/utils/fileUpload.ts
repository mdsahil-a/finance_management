/**
 * Utility for handling file uploads, client-side image compression,
 * data URL encoding, and realistic sample presets for Gold Loan workflows.
 */

export interface ProcessedFile {
  dataUrl: string;
  name: string;
  sizeFormatted: string;
  type: string;
}

/**
 * Format bytes to human readable KB or MB
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 KB';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Reads a File and if it is an image, resizes it using HTML Canvas so
 * it fits within maxWidth x maxHeight and compresses to JPEG,
 * keeping the base64 string lightweight (<150KB) for LocalStorage.
 */
export function processUploadedFile(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.82
): Promise<ProcessedFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read file'));

    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;

      // If not an image, return original dataUrl directly
      if (!file.type.startsWith('image/')) {
        resolve({
          dataUrl,
          name: file.name,
          sizeFormatted: formatBytes(file.size),
          type: file.type,
        });
        return;
      }

      // If image, downsample to preserve LocalStorage space
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight = height;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            dataUrl,
            name: file.name,
            sizeFormatted: formatBytes(file.size),
            type: file.type,
          });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

        // Calculate approximate size of base64
        const stringLength = compressedDataUrl.length - 'data:image/jpeg;base64,'.length;
        const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383687;

        resolve({
          dataUrl: compressedDataUrl,
          name: file.name,
          sizeFormatted: formatBytes(sizeInBytes),
          type: 'image/jpeg',
        });
      };

      img.onerror = () => {
        // Fallback to raw dataUrl if image parsing fails
        resolve({
          dataUrl,
          name: file.name,
          sizeFormatted: formatBytes(file.size),
          type: file.type,
        });
      };

      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Built-in Sample Image Assets
 */
export const SAMPLE_JEWELLERY_PHOTO_URL = '/images/hero-gold.jpg';
export const SAMPLE_SCALE_PHOTO_URL = '/images/weighing-scale.jpg';

/**
 * Realistic Government Aadhaar Card SVG as Data URI
 */
export const SAMPLE_AADHAAR_CARD_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380" fill="none">
  <rect width="600" height="380" rx="16" fill="#FBFBFD" stroke="#D1D5DB" stroke-width="2"/>
  <rect x="0" y="0" width="600" height="52" fill="#7C2D12" rx="16 16 0 0"/>
  <rect x="0" y="44" width="600" height="8" fill="#F59E0B"/>
  
  <text x="30" y="32" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700" letter-spacing="1">GOVERNMENT OF INDIA • UIDAI</text>
  <text x="570" y="32" fill="#FDE68A" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="end">UNIQUE IDENTIFICATION AUTHORITY</text>
  
  <!-- Photo Frame -->
  <rect x="36" y="80" width="110" height="130" rx="8" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2"/>
  <circle cx="91" cy="125" r="28" fill="#94A3B8"/>
  <path d="M50 190 C50 160, 132 160, 132 190 Z" fill="#94A3B8"/>
  <rect x="42" y="218" width="98" height="20" rx="4" fill="#FEF3C7"/>
  <text x="91" y="232" fill="#92400E" font-family="system-ui, sans-serif" font-size="9" font-weight="700" text-anchor="middle">VERIFIED CITIZEN</text>

  <!-- Details -->
  <text x="168" y="100" fill="#64748B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">NAME / नाम</text>
  <text x="168" y="122" fill="#0F172A" font-family="system-ui, sans-serif" font-size="16" font-weight="800">JOHN DOE</text>
  
  <text x="168" y="152" fill="#64748B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">DOB / जन्म तिथि</text>
  <text x="168" y="172" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="700">14/08/1992 (MALE / पुरुष)</text>
  
  <text x="168" y="202" fill="#64748B" font-family="system-ui, sans-serif" font-size="11" font-weight="600">ADDRESS / पता</text>
  <text x="168" y="220" fill="#334155" font-family="system-ui, sans-serif" font-size="11" font-weight="500">Flat 402, Golden Palms, Bandra West, Mumbai 400050</text>
  
  <!-- QR Code Mock -->
  <rect x="450" y="80" width="114" height="114" rx="8" fill="#0F172A"/>
  <rect x="460" y="90" width="30" height="30" fill="#FFFFFF"/>
  <rect x="466" y="96" width="18" height="18" fill="#0F172A"/>
  <rect x="524" y="90" width="30" height="30" fill="#FFFFFF"/>
  <rect x="530" y="96" width="18" height="18" fill="#0F172A"/>
  <rect x="460" y="154" width="30" height="30" fill="#FFFFFF"/>
  <rect x="466" y="160" width="18" height="18" fill="#0F172A"/>
  <circle cx="530" cy="160" r="12" fill="#FFFFFF"/>
  
  <!-- Number Bar -->
  <rect x="24" y="270" width="552" height="64" rx="10" fill="#F8FAFC" stroke="#E2E8F0"/>
  <text x="300" y="312" fill="#0F172A" font-family="Courier, monospace" font-size="24" font-weight="800" text-anchor="middle" letter-spacing="4">XXXX  XXXX  4892</text>
  
  <!-- Footer -->
  <text x="300" y="360" fill="#64748B" font-family="system-ui, sans-serif" font-size="11" font-weight="600" text-anchor="middle">मेरा आधार, मेरी पहचान • AADHAAR IS PROOF OF IDENTITY, NOT CITIZENSHIP</text>
</svg>
`)}`;

/**
 * Realistic Income Tax Department PAN Card SVG as Data URI
 */
export const SAMPLE_PAN_CARD_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380" fill="none">
  <rect width="600" height="380" rx="16" fill="#EFF6FF" stroke="#93C5FD" stroke-width="2"/>
  <rect x="0" y="0" width="600" height="60" fill="#1E3A8A" rx="16 16 0 0"/>
  
  <text x="30" y="28" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="13" font-weight="700">INCOME TAX DEPARTMENT</text>
  <text x="30" y="48" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="11" font-weight="600">GOVT. OF INDIA</text>
  <text x="570" y="38" fill="#FDE68A" font-family="system-ui, sans-serif" font-size="15" font-weight="800" text-anchor="end">आयकर विभाग</text>
  
  <!-- Photo Frame -->
  <rect x="36" y="85" width="105" height="125" rx="6" fill="#DBEAFE" stroke="#3B82F6" stroke-width="2"/>
  <circle cx="88" cy="130" r="26" fill="#3B82F6"/>
  <path d="M48 190 C48 165, 128 165, 128 190 Z" fill="#3B82F6"/>

  <!-- Details -->
  <text x="160" y="105" fill="#475569" font-family="system-ui, sans-serif" font-size="11" font-weight="600">NAME / नाम</text>
  <text x="160" y="125" fill="#0F172A" font-family="system-ui, sans-serif" font-size="16" font-weight="800">JOHN DOE</text>
  
  <text x="160" y="155" fill="#475569" font-family="system-ui, sans-serif" font-size="11" font-weight="600">FATHER'S NAME / पिता का नाम</text>
  <text x="160" y="173" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="700">ROBERT DOE</text>
  
  <text x="160" y="203" fill="#475569" font-family="system-ui, sans-serif" font-size="11" font-weight="600">DATE OF BIRTH / जन्म तिथि</text>
  <text x="160" y="221" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="700">14/08/1992</text>
  
  <!-- PAN Number -->
  <rect x="24" y="260" width="552" height="58" rx="8" fill="#FFFFFF" stroke="#BFDBFE"/>
  <text x="44" y="296" fill="#64748B" font-family="system-ui, sans-serif" font-size="11" font-weight="700">PERMANENT ACCOUNT NUMBER:</text>
  <text x="550" y="298" fill="#1E3A8A" font-family="Courier, monospace" font-size="22" font-weight="900" text-anchor="end" letter-spacing="3">ABCPS8921K</text>
  
  <!-- Signature Mock -->
  <path d="M440 220 Q460 200 480 225 T520 215 T560 225" stroke="#1E293B" stroke-width="2" fill="none"/>
  <text x="500" y="240" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="9" text-anchor="middle">Signature / हस्ताक्षर</text>
</svg>
`)}`;
