import type { User } from '@repo/backend/auth';

export default function Connect({ user }: { user: User }) {
  //   const links = getLinks(user);

  //   if (links.every((link) => !link?.username?.length)) {
  //     return null;
  //   }
  return (
    <dl className="section-container">
      <dt className="section-title">
        <h3>Connect</h3>
      </dt>
      <dd className="section-content flex flex-col">
        {/* {links.map((link) => {
          return (
            <Link
              href={`${link.url}${link.username === null ? "" : link.username}`}
              className="flex text-gray-4 items-center group -mx-2  relative justify-between rounded-md  p-2 text-sm transition-colors  hover:bg-gray-3 "
              key={link.url + link.username === null ? "" : link.username}
              target="_blank"
            >
              <p>{link.platform}</p>
              <span className="flex gap-1 group-hover:text-secondary transition-colors">
                {link.username || link.url} <Icons.arrowUpRight size={14} />
              </span>
            </Link>
          );
        })} */}
      </dd>
    </dl>
  );
}
