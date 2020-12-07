import React from "react";

export default function DeviceDetect() {
  const [isMobile, setMobile] = React.useState(false);

  React.useEffect(() => {
    const userAgent =
      typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobile = Boolean(
      userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
      )
    );
    setMobile(mobile);
  }, []);
  return { isMobile };
}

function withDeviceDetect(Component) {
  return function WrappedComponent(props) {
    const { isMobile } = DeviceDetect();
    return <Component {...props} mobile={isMobile} />;
  };
}

export { withDeviceDetect };
