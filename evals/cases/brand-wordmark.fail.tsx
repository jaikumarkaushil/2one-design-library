// @expect typeset-wordmark
// The bug that started the audit layer: a client screen shipped with the
// wordmark set as type. If this stops firing, the brand is unprotected.
export function Header() {
  return <header><span className="font-bold">2one</span></header>
}
