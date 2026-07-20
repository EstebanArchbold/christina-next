import Link from "next/link";
import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle: ReactNode;
  viewHref?: string;
  viewLabel?: string;
}

/** Encabezado de página del admin con enlace a la página pública que se edita. */
export function AdmHead({ title, subtitle, viewHref, viewLabel = "View page" }: Props) {
  return (
    <>
      <div className="adm-head">
        <h1 className="adm-title">{title}</h1>
        {viewHref && (
          <Link href={viewHref} className="adm-viewpage" target="_blank">
            {viewLabel} ↗
          </Link>
        )}
      </div>
      <p className="adm-subtitle">{subtitle}</p>
    </>
  );
}
