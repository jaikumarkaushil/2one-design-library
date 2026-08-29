// @expect suppressed-focus-ring
// The outline is the first thing that "looks wrong" in generated UI, so it is
// the first thing removed — taking keyboard operability with it.
export function SeekBar() {
  return <input type="range" className="w-full outline-none" aria-label="Seek" />
}
