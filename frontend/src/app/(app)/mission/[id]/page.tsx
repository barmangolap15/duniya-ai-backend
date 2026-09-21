import MissionWorkspaceView from './MissionWorkspaceView';

export function generateStaticParams() {
  return [{ id: 'workspace' }];
}

export default function Page() {
  return <MissionWorkspaceView />;
}
