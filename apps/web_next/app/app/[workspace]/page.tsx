interface PageProps {
  params: {
    workspace: string;
  };
}

export default function page({ params }: PageProps) {
  const { workspace } = params;

  return <div>page</div>;
}
