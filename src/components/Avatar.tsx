import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";
const sizes: Record<Size, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

interface MemberData {
  name: string;
  avatar?: string | null;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const getColorFromName = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `${h} 70% 50%`;
};

export const InitialsAvatar = ({
  member,
  size = "md",
  className,
}: { member: MemberData; size?: Size; className?: string }) => {
  const color = getColorFromName(member.name);
  const initials = getInitials(member.name);

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-semibold ring-2 ring-background overflow-hidden shrink-0",
        sizes[size],
        className,
      )}
      style={{
        background: `hsl(${color} / 0.15)`,
        color: `hsl(${color})`,
      }}
      aria-label={member.name}
    >
      {member.avatar ? (
        <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
};

export const AvatarStack = ({ members, max = 4 }: { members: MemberData[]; max?: number }) => {
  const shown = members.slice(0, max);
  const rest = members.length - shown.length;
  
  return (
    <div className="flex -space-x-3">
      {shown.map((m, i) => (
        <InitialsAvatar key={i} member={m} size="sm" />
      ))}
      {rest > 0 && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-muted-foreground ring-2 ring-background shadow-sm">
          +{rest}
        </div>
      )}
    </div>
  );
};
