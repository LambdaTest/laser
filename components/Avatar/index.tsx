enum Size {
  SMALL = '16',
  Medium = '32',
  LARGE = '64',
}

const AvatarColors = ['bg-blue-50', 'bg-yellow-500', 'bg-green-300', 'bg-red-300', 'bg-gray-160'];

const Avatar = ({ fixedColor = false, name = 'LT', size = Size.Medium }: any) => {
  const getInitials = () => {
    const res = name.split(' ').reduce((res: string, acc: string) => {
      return res + acc.charAt(0).toUpperCase();
    }, '');
    return res;
  };

  const color = fixedColor
    ? AvatarColors[0]
    : AvatarColors[Math.floor(Math.random() * AvatarColors.length)];

  const initials = name ? getInitials() : 'LT';
  return (
    <div className={`${color} w-${size} h-${size} rounded-full flex items-center justify-center`}>
      <span className="text-size-16 text-white">{initials}</span>
    </div>
  );
};

Avatar.Size = Size;

export default Avatar;
