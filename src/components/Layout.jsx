export default function Layout({ children, showNav = true }) {
  const bottomPadding = showNav
    ? 'pb-[calc(7.25rem+env(safe-area-inset-bottom,0px))]'
    : 'pb-[calc(1rem+env(safe-area-inset-bottom,0px))]'

  return (
    <main
      className={`max-w-lg mx-auto h-[100dvh] overflow-y-auto app-scroll pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] ${bottomPadding}`}
    >
      {children}
    </main>
  )
}
