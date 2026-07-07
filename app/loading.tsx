import { MascotImage } from "@/components/mascot/MascotImage";

export default function Loading() {
  return (
    <main className="flex min-h-[50dvh] w-full flex-1 items-center justify-center p-5">
      <MascotImage variant="run" className="w-14 animate-pulse" />
    </main>
  );
}
