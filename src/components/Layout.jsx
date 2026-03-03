export default function Layout({ children, showNav = true }) {
  return (
    <main className={`max-w-lg mx-auto min-h-screen ${showNav ? 'pb-20' : ''}`}>
      {children}
    </main>
  )
}
