import { BASE_FLAVORS, WEEKLY_FLAVORS } from '../data/flavorCatalog'

function FlavorGroup({
  title,
  eyebrow,
  items,
}: {
  title: string
  eyebrow: string
  items: typeof BASE_FLAVORS
}) {
  return (
    <section className="mt-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-black uppercase tracking-[0.26em] text-amber-200/72">
            {eyebrow}
          </p>
          <h3 className="mt-1 text-lg font-black text-white">{title}</h3>
        </div>
      </div>

      <div className="mt-3 grid gap-3">
        {items.map((flavor) => (
          <article
            key={flavor.name}
            className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/6 shadow-[0_12px_28px_rgba(0,0,0,0.2)]"
          >
            <div className="h-1.5 w-full" style={{ backgroundColor: flavor.accent }} />
            <div className="px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-base font-black text-white">{flavor.name}</h4>
                  <p className="mt-1 text-sm font-semibold text-white/65">{flavor.subtitle}</p>
                </div>
                <span
                  className="mt-1 h-3 w-3 shrink-0 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.18)]"
                  style={{ backgroundColor: flavor.accent }}
                />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/72">{flavor.note}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function FlavorShowcase() {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(20,15,36,0.92),rgba(13,10,25,0.96))] p-4 shadow-[0_20px_50px_rgba(3,6,20,0.35)]">
      <p className="text-[0.65rem] font-black uppercase tracking-[0.28em] text-amber-200/70">
        Flavor Menu
      </p>
      <h2 className="mt-1 text-xl font-black text-white">Sabores bien presentados</h2>
      <p className="mt-2 text-sm leading-relaxed text-white/70">
        Separé el menú entre bases fuertes y 4 sabores semanales para que se vea más editorial,
        más vendible y mucho menos improvisado.
      </p>

      <FlavorGroup title="Bases fijas" eyebrow="Core lineup" items={BASE_FLAVORS} />
      <FlavorGroup title="Las 4 de la semana" eyebrow="Weekly drops" items={WEEKLY_FLAVORS} />
    </section>
  )
}
