export default function Layout({ children, showNav = true }) {
  const bottomPadding = showNav
    ? 'pb-[calc(env(safe-area-inset-bottom,0px)+6.5rem)]'
    : 'pb-[calc(1rem+env(safe-area-inset-bottom,0px))]'

  return (
    <main
      className={`max-w-lg mx-auto w-full flex-1 min-h-0 overflow-y-auto app-scroll pt-[calc(env(safe-area-inset-top,0px)+0.5rem)] ${bottomPadding}`}
    >
      {children}
    </main>
  )
}
