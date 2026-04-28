export function GameBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#170f2b_0%,#25164a_35%,#10394b_58%,#3f7b4a_76%,#6ba452_100%)]" />
      <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_50%_0%,rgba(255,227,130,0.26),transparent_54%)]" />
      <div className="absolute inset-x-0 top-24 h-48 bg-[radial-gradient(circle,rgba(255,255,255,0.22),transparent_62%)] blur-2xl" />
      <div className="absolute -left-8 top-28 h-36 w-36 rounded-full bg-[#ff8b5e4d] blur-3xl" />
      <div className="absolute -right-8 top-44 h-40 w-40 rounded-full bg-[#ffd16640] blur-3xl" />
      <div className="absolute left-[-10%] top-[16%] h-28 w-[120%] rounded-[100%] bg-[#7ec9ff2e] blur-2xl" />
      <div className="absolute bottom-[-8rem] left-[-5%] h-72 w-[58%] rounded-[50%] bg-[#8fe26f] opacity-90 blur-[2px]" />
      <div className="absolute bottom-[-9rem] right-[-10%] h-80 w-[65%] rounded-[50%] bg-[#75c553] opacity-90 blur-[2px]" />
      <div className="absolute inset-x-0 bottom-0 h-[22rem] bg-[radial-gradient(circle_at_50%_100%,rgba(255,219,151,0.26),transparent_56%)]" />
    </div>
  )
}
