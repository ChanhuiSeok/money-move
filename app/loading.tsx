import { Mascot } from "@/components/mascot/Mascot";

export default function Loading() {
  return (
    <main className="flex min-h-[50dvh] w-full flex-1 items-center justify-center p-5">
      <Mascot mood="idle" className="size-12 animate-pulse" />
    </main>
  );
}
