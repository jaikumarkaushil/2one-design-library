// @expect no-error-state
// Loading and empty get drawn; the failure path is the one that gets skipped,
// and it is the state a user is most likely to be stuck in.
import { useQuery } from '@tanstack/react-query'
import { Skeleton, Card } from '@2one/design-library'

export function ContinueWatching() {
  const { data, isLoading } = useQuery({ queryKey: ['progress'], queryFn: getProgress })
  if (isLoading) return <Skeleton className="h-40 w-full" />
  return <Card>{data?.map((t: any) => <span key={t.id}>{t.name}</span>)}</Card>
}
