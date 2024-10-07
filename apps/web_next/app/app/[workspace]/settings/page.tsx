import { redirect } from "next/navigation";

interface Props {
  params: {
    workspace: string;
  };
}

export default function page({ params }: Props) {
  const { workspace } = params;
  redirect(`/app/${workspace}/settings/websites/`);
}
