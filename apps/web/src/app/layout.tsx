import {ThemeProvider} from './ThemeProvider';
import '../styles/globals.css';

export const metadata = {
  title: '数学讲解视频生成器',
  description: '面向中小学教培场景的题目讲解视频生成系统',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
