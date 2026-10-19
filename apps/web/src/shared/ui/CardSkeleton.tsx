import { cn } from 'cn';
import type * as React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/Card';
import { Skeleton } from '@/shared/ui/skeleton';

type CardSkeletonProps = React.ComponentProps<'div'>;

const headerSkeleton = (
  <>
    <Skeleton className="h-10 w-10 rounded-lg" />
    <Skeleton className="mt-3 h-5 w-1/2" />
    <Skeleton className="mt-2 h-4 w-11/12" />
  </>
);

const contentSkeleton = (
  <>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-4/5" />
  </>
);

const footerSkeleton = (
  <>
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-4 w-20" />
  </>
);

function CardSkeleton({ className, ...props }: CardSkeletonProps) {
  return (
    <Card className={cn('rounded-2xl', className)} {...props}>
      <CardHeader>{headerSkeleton}</CardHeader>
      <CardContent>{contentSkeleton}</CardContent>
      <CardFooter className="justify-between">{footerSkeleton}</CardFooter>
    </Card>
  );
}

export { CardSkeleton };
