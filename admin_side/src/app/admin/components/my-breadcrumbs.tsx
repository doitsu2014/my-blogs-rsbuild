import { Link } from 'react-router-dom';

type BreadcrumbItem = {
  label: string;
  href?: string;
  icon?: React.ReactNode;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="text-sm breadcrumbs">
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.href ? (
              <Link to={item.href} className="hover:underline">
                {item.icon && <span className="mr-1">{item.icon}</span>}
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-500">
                {item.icon && <span className="mr-1">{item.icon}</span>}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
