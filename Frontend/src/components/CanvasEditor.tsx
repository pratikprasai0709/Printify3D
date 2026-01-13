import { useEffect, useRef } from "react";

interface Props {
  imageUrl?: string;
  scale: number;
  rotation: number;
  onExport: (url: string) => void;
}

export default function CanvasEditor({ imageUrl, scale, rotation, onExport }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !imageUrl) return;

    const ctx = canvasRef.current.getContext("2d")!;
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      ctx.clearRect(0, 0, 512, 512);
      ctx.save();
      ctx.translate(256, 256);
      ctx.rotate(rotation);
      ctx.scale(scale, scale);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      onExport(canvasRef.current!.toDataURL("image/png"));
    };
  }, [imageUrl, scale, rotation]);

  return <canvas ref={canvasRef} width={512} height={512} className="hidden" />;
}
