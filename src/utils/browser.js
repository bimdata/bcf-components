const isMobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
const isTabletRegex = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/;

function isTabletOrMobile() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = isMobileRegex.test(userAgent);
  const isTablet = isTabletRegex.test(userAgent);

  return isMobile || isTablet
}

export { isTabletOrMobile };
