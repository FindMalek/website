import Image from "next/image"

import { CERTIFICATES } from "@/config/consts"

export function CertificatesList() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {CERTIFICATES.map((certificate) => (
        <a
          key={certificate.id}
          href={certificate.image}
          target="_blank"
          rel="noopener noreferrer"
          className="border-foreground/10 hover:bg-muted/50 group block overflow-hidden rounded-lg border transition-colors"
        >
          <Image
            src={certificate.image}
            alt={`${certificate.issuer} certificate: ${certificate.title}, ${certificate.date}`}
            width={1191}
            height={907}
            sizes="(min-width: 640px) 50vw, 100vw"
            className="h-auto w-full"
          />
          <div className="p-3">
            <p className="text-sm font-semibold">{certificate.title}</p>
            <p className="text-muted-foreground text-xs">
              {certificate.issuer} · {certificate.date}
            </p>
          </div>
        </a>
      ))}
    </div>
  )
}
