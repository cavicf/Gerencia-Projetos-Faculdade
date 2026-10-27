import Image from "next/image";
import logo from "@/assets/logo-acadflow.jpg";

/** Logo oficial; importada pelo bundler para ser servida em `/_next/static`, fora do `proxy`. */
export function Logo({ className, preload }: { className?: string; preload?: boolean }) {
  return (
    <Image
      src={logo}
      alt="AcadFlow – Gerenciador de Atividades Acadêmicas"
      className={className}
      sizes="240px"
      preload={preload}
    />
  );
}
