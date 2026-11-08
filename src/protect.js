// 方案 A：提高一般訪客複製、下載、列印的門檻。
// 注意：這些只是阻擋一般操作，無法防止截圖、錄影或開發者工具。
const BLOCKED_SHORTCUTS = new Set(['p', 's', 'u']) // 列印、另存、檢視原始碼

export function installDeterrents() {
  const block = (e) => e.preventDefault()

  document.addEventListener('contextmenu', block) // 右鍵選單
  document.addEventListener('copy', block)
  document.addEventListener('cut', block)
  document.addEventListener('dragstart', (e) => {
    if (e.target instanceof HTMLImageElement) block(e) // 拖曳圖片到桌面
  })
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && BLOCKED_SHORTCUTS.has(e.key.toLowerCase())) block(e)
  })
}
