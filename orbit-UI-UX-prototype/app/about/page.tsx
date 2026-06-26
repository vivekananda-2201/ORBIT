import { AppShell } from '@/components/orbit/app-shell'
import { AboutContent } from '@/components/orbit/about/about-content'

export default function AboutPage() {
  return (
    <AppShell title="About" subtitle="Project · lab notes · contribute">
      <AboutContent />
    </AppShell>
  )
}
