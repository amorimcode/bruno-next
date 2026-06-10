import Image from 'next/image';
import { LocalizedProject } from '../lib/types';

const DEFAULT_ASPECT = '392 / 696';

/* 40 tiles = 40 marcas white-label; paleta fixa para render determinístico */
const TILE_PALETTE = [
  '#e2574c', '#3f6bd6', '#3aa07a', '#e3a13c', '#7a5cd6',
  '#cf5f8a', '#2f8fa6', '#c8763a', '#5b8f3e', '#4c5d77'
];
const GRID_TILES = Array.from({ length: 40 }, (_, i) => ({
  color: TILE_PALETTE[(i * 7 + Math.floor(i / 8) * 3) % TILE_PALETTE.length],
  opacity: 0.35 + ((i * 5 + Math.floor(i / 8)) % 4) * 0.13
}));

type ShotProps = {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  aspect?: string;
};

function toRatio(aspect?: string) {
  return aspect ? aspect.replace('/', ' / ') : DEFAULT_ASPECT;
}

/**
 * Print cru de tela dentro de um frame minimalista de iPhone.
 * A raiz não define `position` — quem compõe passa `absolute`/`relative` via className.
 */
export function PhoneFrame({ src, alt, sizes, priority, className = '', aspect }: ShotProps) {
  return (
    <div className={className} style={{ aspectRatio: toRatio(aspect) }}>
      <div className="h-full w-full rounded-[14%/8%] bg-[#101013] p-[3.5%] shadow-2xl ring-1 ring-white/10">
        <div className="relative h-full w-full overflow-hidden rounded-[11%/6.2%] bg-black">
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes ?? '(min-width: 768px) 18rem, 60vw'}
            priority={priority}
            className="object-cover"
          />
          <div className="absolute left-1/2 top-[2.2%] h-[2.6%] w-[26%] -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
    </div>
  );
}

/** Arte de loja já diagramada — só recebe moldura e sombra */
export function BannerShot({ src, alt, sizes, priority, className = '', aspect }: ShotProps) {
  return (
    <div className={className} style={{ aspectRatio: toRatio(aspect) }}>
      <div className="relative h-full w-full overflow-hidden rounded-[1.25rem] shadow-2xl ring-1 ring-white/10">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? '(min-width: 768px) 18rem, 60vw'}
          priority={priority}
          className="object-cover"
        />
      </div>
    </div>
  );
}

/**
 * Composição visual de um projeto: telas sobrepostas quando existem,
 * cover tipográfico com a identidade do produto quando não.
 */
export function Showcase({
  project,
  priority = false
}: {
  project: LocalizedProject;
  priority?: boolean;
}) {
  const { screens, theme, title, icon } = project;
  const banners = screens.filter((s) => s.kind === 'banner');
  const raws = screens.filter((s) => s.kind === 'raw');

  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden"
      style={{ background: theme.bg }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(60% 80% at 75% 20%, ${theme.glow}, transparent 70%)`
        }}
      />

      {banners.length >= 2 ? (
        <>
          <BannerShot
            src={banners[0].src}
            alt={banners[0].alt}
            aspect={banners[0].aspect}
            priority={priority}
            className="absolute left-[12%] top-[12%] w-[42%] -rotate-3 transition-transform duration-500 ease-out group-hover:rotate-0"
          />
          <BannerShot
            src={banners[1].src}
            alt={banners[1].alt}
            aspect={banners[1].aspect}
            priority={priority}
            className="absolute right-[10%] top-[26%] w-[42%] rotate-[4deg] transition-transform duration-500 ease-out group-hover:rotate-0"
          />
        </>
      ) : raws.length >= 2 ? (
        <>
          <PhoneFrame
            src={raws[0].src}
            alt={raws[0].alt}
            aspect={raws[0].aspect}
            priority={priority}
            className="absolute left-[14%] top-[12%] w-[38%] -rotate-3 transition-transform duration-500 ease-out group-hover:rotate-0"
          />
          <PhoneFrame
            src={raws[1].src}
            alt={raws[1].alt}
            aspect={raws[1].aspect}
            priority={priority}
            className="absolute right-[12%] top-[28%] w-[38%] rotate-[4deg] transition-transform duration-500 ease-out group-hover:rotate-0"
          />
        </>
      ) : raws.length === 1 ? (
        <PhoneFrame
          src={raws[0].src}
          alt={raws[0].alt}
          aspect={raws[0].aspect}
          priority={priority}
          className="absolute left-1/2 top-[12%] w-[44%] -translate-x-1/2 -rotate-2 transition-transform duration-500 ease-out group-hover:rotate-0"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8">
          {project.coverStyle === 'grid' && (
            <>
              <div
                aria-hidden
                className="absolute inset-x-[7%] top-1/2 grid -translate-y-1/2 grid-cols-8 gap-[2.4%] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              >
                {GRID_TILES.map((tile, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-[22%]"
                    style={{ background: tile.color, opacity: tile.opacity }}
                  />
                ))}
              </div>
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(65% 65% at 50% 50%, rgba(10,8,6,0.88) 0%, rgba(10,8,6,0.55) 55%, rgba(10,8,6,0.15) 100%)'
                }}
              />
            </>
          )}
          {icon && (
            <Image
              src={icon}
              alt=""
              width={72}
              height={72}
              className="relative rounded-2xl shadow-lg ring-1 ring-white/20"
            />
          )}
          <span
            className="relative text-center font-display text-4xl italic tracking-tight sm:text-5xl"
            style={{ color: theme.fg }}
          >
            {title}
          </span>
          <span
            aria-hidden
            className="relative font-mono text-[10px] uppercase tracking-[0.3em] opacity-60"
            style={{ color: theme.fg }}
          >
            {project.platforms.join(' · ')}
          </span>
        </div>
      )}
    </div>
  );
}
