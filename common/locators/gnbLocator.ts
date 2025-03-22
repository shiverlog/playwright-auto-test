import { Platform } from '@common/constants/ContextConstants';

export const gnbLocator = {
  benefit: {
    [Platform.PC_WEB]: "//*[@class='header-gnb-list']/li/a[contains(.,'혜택/멤버십')]",
    iptv: "//*[@class='header-gnb-list']/li/a[contains(.,'인터넷/IPTV')]",
    [Platform.MOBILE_WEB]: "a[data-gtm-click-text='혜택/멤버십|서비스+|유잼']",
    [Platform.APP]: "a[data-gtm-click-text='혜택/멤버십|서비스+|유잼']",
  },
  ujam: {
    [Platform.PC_WEB]: "a[data-gtm-click-text='혜택/멤버십|서비스+|유잼']",
    [Platform.MOBILE_WEB]: "a[data-gtm-click-text='혜택/멤버십|서비스+|유잼']",
    [Platform.APP]: "a[data-gtm-click-text='혜택/멤버십|서비스+|유잼']",
  },
  udoc: {
    [Platform.PC_WEB]: "//*[@class='header-gnb-list']/li/a[contains(.,'유독')]",
    [Platform.MOBILE_WEB]: "//*[@class='header-gnb-list']/li/a[contains(.,'유독')]",
    [Platform.APP]: "//button[contains(.,'유독')]",
  },
};
