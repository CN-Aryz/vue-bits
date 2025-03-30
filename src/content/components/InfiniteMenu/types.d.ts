export type InfiniteMenuItem = {
  image: string;
  link: string;
  title: string;
  description: string;
};

export type InfiniteMenuProps = {
  items?: InfiniteMenuItem[];
};
