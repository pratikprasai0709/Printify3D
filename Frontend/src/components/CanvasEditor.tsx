import { useEffect, useRef } from "react";

interface Props {
  imageUrl?: string;
  imageScale: number;
  imageRotation: number;
  imageX: number;
  imageY: number;
  text?: string;
  font?: string;
  textColor?: string;
  fontSize: number;
  textScale: number;
  textRotation: number;
  textX: number;
  textY: number;
  color: string;
  onExport: (url: string) => void;
}

export default function CanvasEditor({ 
  imageUrl, 
  imageScale, 
  imageRotation, 
  imageX, 
  imageY,
  text, 
  font = "'Inter', sans-serif", 
  textColor = "#000000", 
  fontSize = 40,
  textScale,
  textRotation,
  textX,
  textY,
  color, 
  onExport 
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;

    const draw = (img?: HTMLImageElement) => {
      // Fill background with the user-selected bottle color
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 512, 512);

      // Draw Image if provided
      if (img) {
        ctx.save();
        // Map imageX and imageY (-1 to 1) to canvas ranges
        ctx.translate(256 + (imageX * 150), 256 + (imageY * 150));
        ctx.rotate(imageRotation);
        
        const maxDim = Math.max(img.width, img.height);
        const baseScale = maxDim > 0 ? 300 / maxDim : 1;
        const finalScale = imageScale * baseScale;
        ctx.scale(finalScale, finalScale);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();
      }

      // Draw Text if provided
      if (text) {
        ctx.save();
        // Map textX and textY (-1 to 1) to canvas ranges
        ctx.translate(256 + (textX * 150), 256 + (textY * 150));
        ctx.rotate(textRotation);
        
        ctx.fillStyle = textColor;
        ctx.font = `${fontSize * textScale}px ${font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, 0, 0);
        ctx.restore();
      }

      onExport(canvasRef.current!.toDataURL("image/png"));
    };

    if (imageUrl) {
      const img = new Image();
      img.onload = () => draw(img);
      img.src = imageUrl;
    } else if (text) {
      draw();
    } else {
      // still fill background color even if no label/text
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 512, 512);
      onExport(canvasRef.current.toDataURL("image/png"));
    }
  }, [imageUrl, imageScale, imageRotation, imageX, imageY, text, font, textColor, fontSize, textScale, textRotation, textX, textY, color]);

  return <canvas ref={canvasRef} width={512} height={512} className="hidden" />;
}
