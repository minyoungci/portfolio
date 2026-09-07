import GlassButton from '@/components/GlassButton'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-card">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">404</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-3 text-[13px] leading-6 text-muted-foreground">
          주소가 바뀌었거나 삭제된 페이지입니다.
        </p>
        <GlassButton as="link" href="/" variant="solid" className="mt-6 px-5">
          Home
        </GlassButton>
      </div>
    </main>
  )
}
