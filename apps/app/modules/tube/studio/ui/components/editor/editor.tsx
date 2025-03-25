import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@repo/design-system/components/ui/resizable';

const Editor = () => {
  return (
    <ResizablePanelGroup style={{ height: '100vh' }} direction="vertical">
      <ResizablePanel className="relative" defaultSize={70}>
        <h1>Navbar</h1>
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            flex: 1,
            overflow: 'hidden',
          }}
        >
          {/* <MenuList />
          <MenuItem />
          <ControlList />
          <ControlItem />
          <Scene stateManager={stateManager} /> */}
          <h1>Scene</h1>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="min-h-[50px]" defaultSize={30}>
        {/* {playerRef && <Timeline stateManager={stateManager} />} */}
        <h1>Timeline</h1>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Editor;
