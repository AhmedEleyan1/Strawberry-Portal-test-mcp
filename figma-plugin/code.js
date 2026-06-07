// Universal Strawberry Portal Screen Builder
// Reads screen definition JSON from UI and builds Figma frames

var TOKENS = {
  colors: {
    varmGrey:        { r: 0.969, g: 0.961, b: 0.953 },
    pageBg:          { r: 0.969, g: 0.961, b: 0.953 },
    cardBg:          { r: 1, g: 1, b: 1 },
    textPrimary:     { r: 0, g: 0, b: 0 },
    textSecondary:   { r: 0.443, g: 0.439, b: 0.435 },
    textLink:        { r: 0.353, g: 0, b: 0.196 },
    borderLight:     { r: 0.922, g: 0.914, b: 0.906 },
    borderMedium:    { r: 0.847, g: 0.831, b: 0.816 },
    selectionBg:     { r: 0.992, g: 0.941, b: 0.937 },
    selectionAccent: { r: 0.988, g: 0.369, b: 0.345 },
    statusGreen:     { r: 0.176, g: 0.522, b: 0.255 },
    statusGreenBg:   { r: 0.176, g: 0.522, b: 0.255 },
    statusGreenText: { r: 0.176, g: 0.522, b: 0.255 },
    statusRed:       { r: 0.773, g: 0.161, b: 0.141 },
    statusRedBg:     { r: 0.773, g: 0.161, b: 0.141 },
    statusRedText:   { r: 0.773, g: 0.161, b: 0.141 },
    statusBlue:      { r: 0.231, g: 0.510, b: 0.965 },
    statusYellow:    { r: 0.898, g: 0.631, b: 0 },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  layout: { cardPadding: 32, cardRadius: 8, colWidth: 320, gridGap: 16, fieldGap: 32, contentWidth: 1392, sidebarWidth: 80, headerHeight: 80 }
};

var COMPONENT_KEYS = {
  active_True_State_Default: "d0f2b3d5a070ce7ce144c19fffe4df8f54fa857a",
  addCompanyListComponents: "8c4778433afe157ba1c14764e422b3e0f2abb61e",
  addNewCompany_ListComponents: "9c48ea56bb8ebb32253b02892fecbece249ce70a",
  alertCounter: "92c968d5144b770c1ea215682b99fe7d8630f0e6",
  alertError: "cfa97d5e85ef50be80dcd59c4f900d9faad68dcc",
  alertErrorOutlined: "4728c74c8f12a57cb1bffb0fe8bb946b97c455cf",
  alertHelp: "e84727d24e58feb8128806ef9675e1a89dad17cd",
  alertInfo: "6914f5cb9f180144235bf1c7ab814ff3bfcee8ea",
  alertStatusMessage: "24be8b9bf3b5d0cff3b751d6a307eb0fcbc1bd6b",
  alertWarning: "9bcd0208f242d3a37c77942bc152d7e32294f097",
  alertWarningOutline: "1829fca4daaa17b0257eb1e03bea50671dc7fe62",
  arrowsArrowDown: "8c4ad3c79e078ccef0ef29ddc9867569cee14544",
  arrowsArrowLeft: "9ad9f3db0beebc8878f43cb6c098c13d9117bc7e",
  arrowsArrowOut: "6a8b08631d23d998659f26baea327d926eab8c03",
  arrowsArrowRight: "2f36f5fcd8c0dec85bb271b7fb55cb8d55ac63c8",
  arrowsArrowUp: "2f0041e1ba23729cc61404681adcdb136a39919d",
  arrowsCaretDown: "366b4078efc8ad57d6f04ea814f159e3ab3f2554",
  arrowsCaretUp: "c400dd767f403de712ec218132f14731ca59d3a3",
  arrowsChevronDown: "1724cadae6626d0d78ccbd84b0ee98b9c59e71f6",
  arrowsChevronLeft: "cafe9b417b8dd036ec99f1d331735f6d3baf124c",
  arrowsChevronRight: "0e6e35a3b62d8ba873a5490440e5a09dd3a1336c",
  arrowsChevronUp: "65399b724fe79e2b179694aca4c367189f0a8cff",
  arrowsFirst: "f69d2eb53abaabcce802e35ac47dffc60e8869b9",
  arrowsLast: "330db723eb0124ba1e56723664ac75835044c788",
  backButton: "eee443bcc2bf893c544efa68683aea0c93a7da6d",
  backgroundNo_Size_Small: "be4ecb05c91099756b799841c2ac676b155afda1",
  badge: "6d920e207fcb2b9460c0f497972463991c7fe1a1",
  barChart: "173fec3eea2e308a5b143516bf79c7824e7d93e4",
  billingAccount: "02f75153b731b36614ac90dd2acd639952c8ffb0",
  bookingContent: "42fc06ab8460e93ff40742bffa7aaff05e4ba261",
  bookingListCategory: "01cd23c0f2f89fd58442f8b147e0ca601b6e2ec3",
  bookingListItem: "d0a23d2c01240961836919a022189fd66a416d9e",
  bookingSource: "fff0c53fb479aa8fe049b093b6838739183c3450",
  branch: "4180e36f4f9db39d97d40705d4ae098b259735a2",
  breadcrumb: "686dce8fa14f36101587076ed01cd56f84edc4a6",
  breadcrumbBtn: "3ba25bb20d80c695dc7e8e48373aaa9956a1ecb0",
  buildingsDepartments: "c555541c1fe4ca6b86cd4f764dbb49003f80b651",
  buildingsHotel: "8ad06c93539227a678022b6f81f8bddc25bcabd9",
  buildingsHotels: "70bd3d0c2b1c97ca2f5b428e92cc929b7185407f",
  buttons: "20e403be798f7a9d7300a0d6184e71655b4c02c0",
  buttons_Link_Medium_Default: "aacea6f05d7f25db1672cf4a0d3dbead1f1bf119",
  buttons_Link_Small_Default: "c2c80910b7ac372457a46ca787d25449a83ec308",
  calendar: "4a7f27315eda5c181e978566458d28f1dfec669e",
  calendar_Range_Hover: "2cb4908b21e70208ce7295dca9c27025f6ef1275",
  cardHeading: "62311d193bef1cb4a08dae085bf58ef2ee704f4e",
  cardHeadingButton: "bf81bcef55ce6598fecefb8750ee952225bb2e45",
  cardListItem: "a7ee8c2f6b4b17c3b2564f4286442e4fd752b0b2",
  cardTitle: "cf300900c0e29e0ea8f39152ddef757444d9f5d3",
  categoryOpeningHour: "ea80c79580b894cc41c34132145549a1a4420730",
  chargers: "c7b2dc21e2dad9e982aded947a693d9f870535f6",
  checkbox: "84a92aeb40fd89854230efb77106b295b3f42b02",
  checkCircle_2: "ec921d052c6d35af83457dc1a11a7ecd8026341d",
  close: "90a06b7dd8a64962282c8d63105ea548752a448d",
  closeBill: "828e71eaa68749432d0783688d4198502e5e3a04",
  companyName: "316b108dd1ce83af00be8b036dc392fbe691f178",
  contactMail: "d65a9c5a514d796e55ead9b171b456a21681f16d",
  contactPerson: "4607ec4ad9f21c3a71911489f1e229c4bedb4544",
  contactPhone: "1052deecb752d536f25ae7fe892a899c7ec553e4",
  copy: "ce484afdb8241350726af43673186b7dfcbca3a9",
  creditCard: "dd57054d4afd73e9948bdf7662f7e098311eb38b",
  creditCardOff: "6092ef9452d2d4734bd08fb3cabb7eed77578754",
  dashboardCard: "60b641b22c3c88bbeee984505c24fd59ae5447e5",
  dashboardCardContent: "3e2dde501175ccea32499d7809feb75b38b70ae8",
  dashboardTopCard: "6bc074bb8a772c14539daa9ef58186efa7bbf441",
  dateDefault: "8e14b50dfcdc6676aa0775c443d87c90a155be80",
  day: "8ad158bd8e8e38c7d7faf367305582065da04e91",
  delete: "3614cd10b4525d7931d04cb258a0e7a9c0bc533e",
  detail: "3f0fb053ab466b58b0469f27665392249fba3310",
  details_Panel: "92faef47274bd7f8fc792feb0bac3fd14a078859",
  detailsCard: "361693349d5bb71d71f31f2bdeb43c0cd4689a83",
  divider: "566667e2f1ce1f5c3f1ee604616342e046103b66",
  dropdown: "afd83042d1f4dd7892f82999dfa7b34a2452fb06",
  dropdown_Yes_State_Default: "04e7ee157760c4050e12334d3ab74e4a9bf2a9e7",
  dropdownMenuTemp: "a43a9ee26aa0aaf9196c762a00c5d58e9776564a",
  error_2: "e65b340d25ae91fc2025c603d9f0ecf65490a376",
  exception: "952d01aa712063a0a7f968fae25cec5eb07e7b70",
  full: "5532e39725a52112cb360fe56e5f8881b140af4e",
  functionalIcons_MyStay: "f67a5646640d086f352599bdfbeb5319c861a245",
  functionalIcons_Navigation: "958ee8bd1b61f5ea084709661f85fe9f36d8b87d",
  functionalInformation: "b601c0621441174104c72c2922ce14c352b6dad1",
  functionalSearch: "a0e9bb1f009e4e72cfd23ab72ada4eb17fdca568",
  groupRichButton: "8b2481fbfc08c8f1f59960a488468e9317014eca",
  guestBooking: "2bc1d4d573707aa7595a493bb3c692fb7736680e",
  guideline_HIG_Active_False_Line_None_Icon_False_Text_True: "53e5846d93655b97cef1bf0d4275d8cf598729a8",
  header: "b0fe01dcb0ad8974c1cfa7c9428fd434fa1dee95",
  helpIcon_False_Arrow_False_State_Default: "79b47ac4d0e4513333f0b7869cffee958d2d93cd",
  hotelAccommodation: "d65b005c4140b52437e89834895ee04c9bc35eed",
  hotelActivity: "df95154a327343268907ea478b4db788947411c1",
  hotelAppointment: "7d7eebab5e4ccb69ac909b8b9ed0e0a526e752c1",
  hotelAppointmentOutline: "230fbcf0817c282c3fd34319c9597af37fac45d3",
  hotelBook: "0743d8973516743e0cd3f24d95258b0efa410f5c",
  hotelCheckin: "726e70919d416c59b6b36526443535307822a0db",
  hotelCheckout: "78a0c83c19997f766c4f2d006a22af95ecfbe366",
  hotelCleaning: "f5e548a3e781d220ed005a2fb80d17f67657778b",
  hotelDining: "d30d28edb63b1e702332d287555d543627c23923",
  hotelListItem: "36304af4481f4e8d6b91c0136d36707750f55e5e",
  hotelName: "4873c2b3b57f743b9c0c172adfb7458de8f06011",
  hotelSpa: "f032085845c5ba8de49dc970f96854be87f419c3",
  icon_Check: "be14dc9c341893e70a6d8f948576c29923a064c0",
  iconDashboardColorSelected: "2283761660ba35949ea880b71ac9c97adfef5def",
  iconPlaceholder: "76ffc3cd5c154ad65be15bb2f75b0aabe470371e",
  inputfield: "4306c85b2a66b9a3e19f5944e95f77a0228bb0cf",
  leftNav: "e006f8580bff20abf5bd82cf0c674d9ec70436e6",
  levels_4: "1cae08227760305af49a8e1d9c1af92d885265b0",
  lightbulbCircle: "4448483e5c962b22b98ea9a2b11108047da3c486",
  line: "567e8c54ac3aa1bb3e713376060f9c228ce83ffa",
  list: "292ce5a2cc614cbc8ac9c132ca5cc206935b2e30",
  listItem: "8b18b4dfc51292ab2e969f0294e9328c7a3cb6da",
  listItemTitle: "dfd52c49dfa34e46163b83a9e9b2a501e1f9b038",
  load_ButtonCircle: "07ad0ca42ef7ec689d314586791165fe262c12fd",
  load_LinkButton: "4687fcafc0455e64de5c396ac5b0d1027501c98d",
  loadingIcon: "a65a9846ccf8c437c9d094a15e7c7a6030a8c987",
  localBar: "ffa5c4a57205fba0dc793948d6bd42d3f409746e",
  locationPin: "8d98dc9dc60b228b8791f3f6e90eb88b4206bdcb",
  locationPinOutlined: "25c282ca4813e52640dba155d9cef37027c6c568",
  lock: "ed1861ad9d72d6646eab1d84f0583045b890fbf6",
  logo: "a93deed2171e5e290ccbc44cebd0ef7ebe647c81",
  logo_White: "faff1e758dd3ae32351ddc056b6ec34632df9af5",
  mainAccess: "0b3291f5d9962aeadf407b1e8ff4b2d1963f6a90",
  mainAdd: "9bfdcd002a541ec607f414b085af611e3bf5b2ea",
  mainAddCircle: "42eb18f0406dd06f713a830b1ead69d586ea868e",
  mainCheck: "cdba10302fbf7fff83d3c869c7ce4ea4890f6cb4",
  mainCheckCircle: "605054cd12b5f7e17d2ac9e5bb87c7ae08bd4f14",
  mainCheckOutline: "fa92caa28802ef9cd7c81e7a6d6d0d4f39d03c48",
  mainClose: "de816f67821c63880e43ae3d1c7b187dd2e410fe",
  mainContract: "440709623baec4101c9e202066aac2bd9bed6ef8",
  mainDelete: "f5204fff2065970da552b7e25426eb4916b79a9b",
  mainDotFilled: "6c9a40e0842d79456913e0f7ecf30aa1515838ae",
  mainDotOutlined: "c7a6dc6f33cab441d454591a804ce032b369ce60",
  mainEdit: "05627f3cfecbcda3d5438700ddc2bf40a18a9175",
  mainFilter: "c5186ee23848c83ac76f15e3a92d350b66c40bd1",
  mainLightBulb: "a10c4f83e2f8b2f473033fb370cc59a8a049c467",
  mainLogout: "f436d04a8758de735a7b37d60fd238ab125415f5",
  mainMore: "e7ea76bed32dcd42d91b8e3dc320d1d1cfb5acdd",
  mainNewWindow: "df6587d005663ddf8141f707298a3457c041a360",
  mainNote: "15b5a3e0ee0ced7e38698ded80717055d82976f6",
  mainNotification: "cbfad811c53d4d8e197eeb2cefee142c624ffe32",
  mainNotificationOutline: "4c7942f47ae7085f7edbdb3a88a76ede0200e288",
  mainPin: "816232839302bae2c903f6d5b9b2a1f4a40f60db",
  mainPrint: "6c3ed7a0290c156def39a194276bd62fe9ec7575",
  mainSearch: "223e71b89737cfe57fd48b21c2d3855c44e4eafb",
  mainSearchFor: "25fe28fa0503679d20e91ee102bd565a1800a64a",
  mainSettings: "81fd406d0f87819cd301734e4b364a1299b47d8c",
  mainTag: "870062d1603847de058f7f2be57aeb6de396ab83",
  mainUpdate: "77e075cd5c680a2ba7dd9be3da21eff4c0711dc2",
  mainView: "4c739e19476414148ff05dad28941e4b30b58207",
  menuIcons: "5377d7c8de9e631a0d3c6fdcb6b84eb2225ca39f",
  menuTab: "37a763bb3afef43acf4542e268d84bf423b119d6",
  merge: "84336b33652c7d6661577c1f99e0a38cbd7ca9cb",
  modal: "28abafeff5eecb45bfc6ffd2049bf366742ef6b9",
  modalContent: "43f2a4117311dd39dc866767f475b66ce8428b75",
  moreVert: "b8bee01648d149be8f51cc2c1896f69f80de1beb",
  name: "32b4249386a5811b547a440ec6e598c005058057",
  nameCard: "b90a720702e6fe3906d2f7fbb60f2a80c7a1984e",
  navigationChevronDown: "48e5a746184851750a7cc6018f631a54ed971ded",
  notificationDropdown: "bdd242fa3a4e6e9487a050166be01f81b86390c1",
  numberButton: "715dd62971e964a9764b3110109933edfbed8b53",
  o_List_Panel: "ac4b946ba699a98bbcb3c1d585dfe99b0b508f3b",
  otherHover: "acb79e68143eb86ac6920761b34a2e67e4f2e3b7",
  otherPressed: "0bb996307bc46128c0eb92a6140f7488eaa4c92d",
  panel: "da9ec26c0af3e03389a73c6768753f377099a4f3",
  panel_Title: "12688b19596cde27e32ee144c0b18e93963a0098",
  paragraph_Panel: "b37f6f65223bc57159deea7ca0996c23c0b0f071",
  parking: "560fc94abd27492617f7e6f7f55dfbf6318d7e6e",
  peopleAccountCircle: "d3ac3e2fc4b6f6f8e0c2e7b926492974c8793a31",
  peopleGroup: "d21e743b2623b8cb06b624a744dfddc068ae7bf4",
  peopleGroupOutline: "5f50bc039fb671d14fbab4a800a94fdef62e8d48",
  peopleGuest: "9c2a98c6aa9bb51eb5edeedd3860f377a73fb128",
  peoplePeople: "8150ea26d46eb01b539ff07ca54d4907e18c9395",
  peoplePeopleOutline: "62c52f53ab285cea02f602cdd949868606645282",
  peoplePractitioner: "816cad823e01c9a98ab76192d6cb1c2cc2376e85",
  peopleProfile: "46397f7da00e8f750e14c7c5940cdd77c4144acd",
  peopleRole: "bcf092cab41b1468caefcb385fd153f09fb6b11a",
  peopleUserSettings: "1abcddefeecd1e87114ff60a63c5fba109a456fb",
  personAdd: "a0ea6a970865744738311eb1865f78b7033accb2",
  personOff: "cf89d14450cc7a9045598b42934317e3cb70ed13",
  playCircle: "89a3663d477c7de476bca9f2a2b2c72a8550f168",
  positionTop: "33d39f3d3cf15db182084dca548667fc178d46a7",
  profileDropdown: "a5636a3c8f4f6ab8f0b26932ec3c30018f577b86",
  property_1_CCS_Combo_Type_2: "26716d3fb941892cfcbf0ad773e7467b6bba0747",
  property_1_Default: "51042099c1a625c23015ca804e4c7960b2d3e7b5",
  property_1_InProgress: "47f5be54c4db590e2d27264ded5ee2d9854ec435",
  property_1_New: "a20361ac82ddf4ca253371765112a5956307a138",
  property_1_Open: "26ef12e8bd86f51245920b83d6b557fab8a4a91a",
  property_1_Rectangle_1: "3a65a80a99ee36befc88ab57af28583cf9aade10",
  property_1Closed: "93776930cad9b4dff3c0e65864c4394838e8506a",
  property_1HotelDropdown: "a196a607fd8c3993e0db017ef58968b2246113dd",
  property_1None: "9313ef73f44929611e8d0e7b51cd932f22153a74",
  radioButton: "a6f8c0cc273a01de4c267be11726bda8a9d16b5c",
  range_Percentage: "4fb0d94011d88b8d08f99f02ea63ba179c4f8918",
  ratesCard: "a6b12bbfd6323d0292a242b33edfde5b0322aca0",
  recentListItem: "74a70e7d350bb90f17cb390feefe81d2f2d70a89",
  resultListItem: "8622a4cd972f452e81af5cb72d5b5cfd3c0ed236",
  resultTabItems: "ea283b8dee152838685d58c7040dae6e88b07019",
  resultTabs: "731d7d896e04cc2b6049e10acfabd902e62bf8d6",
  richButton: "a6691da79a90d3e47b60bcdcfaa350e61c6d6af9",
  scheduleCard: "7292255745f617fd6e1bca4497b647e4035db1ae",
  searchCompanyAndFill: "bd1ad69215f29acd2ac2ad9e6aa5b7cf58441d85",
  searchField: "0f9d35911f2f15ba40268c3fa8f712a2e64e3219",
  searchModal: "e57f4519454a684436d3c775f35ee2765da772e0",
  searchReport: "55958eb528ce259beeffd2e9b83cc92983cec65c",
  single_Percentage: "11b0295bb2ef1f95d1e14c9255a4b3378fe415ce",
  single_Trait: "a4535b6de4cbd9977f51883e4ec51a7a6345be5e",
  size_24: "36ceaf7d293d7d4d842660674eba9feb80a10584",
  size_Static: "115d9c9ae5c905a175fa90c784238d23924304a0",
  sizeSm_State_Default: "73e35f32393a9645fa8f8a86718278f58f59cc99",
  skeletonBadge: "83be5c129644092b3355aa64ff002cbaae96519e",
  small: "9006f28ef0142085372ad41f50f8a39558a59f02",
  spinner: "a29a89c0b91d999576532a8b9f97974d802ce8a9",
  state_1: "683c9409edaaa54c0194a0e76d27fce7eb73ff42",
  state_Active: "7d4bd233e5cf8c1addb87366e56ece5cd3270292",
  state_Closed: "521ee6122a252cbfc8f8800bf241c156cb55cc59",
  state_Default: "61e5fe1b81922b759e2537708e91f3382445ce84",
  state_Default_Active_Yes: "27a531611a8006a007c8a02718a20767eb5e88dc",
  state_Default_Hover_No_Outline_No: "e64e06298deec9c07ea706de89bfeb555daaa7b8",
  state_Default_Size_Large_Style_Outlined: "43d3c7ed616a96314a15571a653e269af5b44fa2",
  state_Default_SizeSm: "473272f2ced57ecec9d1f8b47de5927a07a69967",
  state_Inactive: "458431d94f13e81057250f894748fbbd6eb83f4b",
  state_Inactive_Size_Medium: "fe8684fd6a06a66a316ebece88c170e35b9afbfa",
  state_Inactive_Size_Small: "2083139e10c244a494a6c3c718f9603c87bf3603",
  state_Inactive_SizeDefault: "78253058c276b708782969d9fa3e10ec8c82c62c",
  state_Load1: "27f4929f45708015caa05093e58f2a0d3b1e6001",
  state_On_Off_Disabled: "24fd4a96843838624a505c196a4888b653b84c38",
  state_StrawberryLogoOnly: "f181823b9a268ba588a19eaa06b08316da458b13",
  stateDefault: "64a34a92e1ffedc6c90cd144400e8193311f31c3",
  stateDefault_OpenNo: "4240f0b3110a89d08a88e345652f4d195e857bda",
  stateDefault_SizeSmall: "cb60f87955e89134d69204934ceae24e661e66d9",
  stateInactive: "81b5305ddec7f4464fe00f32b9c004e6e456682a",
  stateInactiveHoverNo: "e1bcc4d718ff906768e1d0be79067690fd285bd1",
  stateInitial: "9ec1b32397ccb23c99aa4214cd4e217b27dcb62d",
  stateLogo: "922ef85ade5dbd4d3fab358052767f6ad0c6dc36",
  stateNotifications: "1bb5df6c6efd224e98f542d3ff4e56fcd56f4cf6",
  status: "08fb1d121b89d5ddf19a1309b774a1a1e22046de",
  strawberryLogo: "009d2d076270e9b9db87cfb9d952b4fbadfb9961",
  style_Outlined_State_Placeholder: "36ab06326f4ee6cb55791b5af81c63c8f03dde90",
  subtitle: "e11f184b7653fda03658c88bc0c458c70be1b06f",
  systemIcons: "dab5d8408b012254c0d5983d47ed991d8c8a3a10",
  tab: "7c742ef242107684edd1fea3d05d842f35f79285",
  tabButton: "f67a4525615b9a9675143f41b35017388efa9c4a",
  tableCell: "3ddab8566757e4c4a78353f3890ce72b60969aa1",
  tableHeader: "4bdf8d0a75be17de3e2b583c61bf212e9388c148",
  tableHeaderCell: "e11c940f536e98ea024595abf76037e78b235184",
  tabPattern_HugContentLine: "42cf8084e5b6d7cc3b04dd727457f6782d82848b",
  tabs: "fb927dd865e29bc25c6e7fe39df2bcdd2a02cc23",
  tabs_Default: "6046618681125dd58fbbf047ed180517376394a7",
  teaserCard: "72f83a1639ed1b68cabfde150d4d11f802f7590d",
  textfield: "318b6f22593992c376a5798878f1944497429adf",
  thumbDown: "1496795d88b443c0340880e2b15866129afba0ef",
  thumbDownFilled: "439ef7f2c2ac5f20bfb72e692d41595639c63eb6",
  thumbUp: "d8d6f63d5fa6e5623b83bebc1891cff9707adb88",
  thumbUpFilled: "09e29d7af620910fe662b89e8ca683feb5fd03ca",
  timeCalendar: "46409c786b6637e4fdb2af84ad4e31975ca4d3a0",
  timeCalendarOutlined: "1f7d57344563ec1c93d2493ba479f58df26e7fda",
  timeEvent: "3c2090a65dfc4489493a79ff04cb3ef9b64afaef",
  timeEventNote: "e748568b8b0609a2f667000fee9bc477bd5e24f9",
  timeEventPrevious: "b915308f4dff95af4b971351f53c5be131472aaf",
  timeEventUpcoming: "dd050fc42144fec31d533eb9dcb571f94c921597",
  timeHistory: "69b30a1ff3eac814d4154109d57cbada23c3a47e",
  timeReservation: "2cb8f3e429ab22c5b58e1d327b0c8fad31f0b5e7",
  timeTime: "f8b39dab87c28d803b07139eca1d54ebf6bb617b",
  toggle: "b19ebe68611ee8d2bbae81b9217d68ba759d1a6c",
  tooltip: "b3d790e19b44159b6bf2950e0a34a288332ee73b",
  tooltipBtn: "3efcbd4c35f4d6235e49e759c0bfb79d6828270d",
  topCard: "797377cb34f24970d7bb39dc3fecad72d349e062",
  topCardExtra: "14a4c7e8a57b7b6d25e473ed1abab4a795c3600b",
  topMenuBtn: "4a59ae97c2a06e772e853cad53042cf094326bc6",
  trait_Line: "b10c858e06bcc6461c07c668256f1dc1acf28507",
  trait_Tag: "24311eccb5251ee2fedef6d821b9f46f10d91901",
  type_Framework: "c194122702f013ef7effd4f7182ccfeb9550dc9f",
  type_Link_Button_Size_Small_State_Default: "f71f81eb667246a3cc3f2b06bb384606e5a52342",
  type_Logotype_Secondary_Color_White: "d01313d19a161d7b97679d7bd208ee3f94d63309",
  type_Placeholder_Size_Large: "dca43a2fd2a1876e7a19fa0eac1d720c06b4580b",
  type_Placeholder_Size_Medium_OutlinedYes: "4d053837054589cb38a24cd04b54bcb42ab68688",
  type_Single_Selected: "5e2dc62f10674c74056c1b625f3c4525fc00e761",
  type_Standard: "99c5d14cac6354750ea1f172b5b5f8db4b61c0bb",
  type_Symbol_Color_Black: "4adca711047241e3bfcd13d38052efd401c8d4c9",
  type_Text_Size_Small: "f1f996805efb50f7a48dfb4d70af0e1a4a51d17a",
  type_Text_StateDefault: "c3b07b6bfac3e1f447d133448f0eb8c212238d64",
  typeAccommodation: "2a05cf3bfe29d3b2fd5c52d533ad6cea5d5a1f61",
  typeCardContentTable: "4bf014bc62a5535f7d9e4eaf8c38d74843592254",
  typeCheckInStateDefault: "100bb8203285e40b4a43d7c2e057755a38c401ce",
  typed_Content: "436ab74d48f0fd25b0b8732c7031046af496c9d3",
  typeDefault_StateDefault: "d637bff994e626ff79aa02366134d33af382a165",
  typeIndicator: "397c655caa6510be5b72a0550a7fae5edd5f9cb8",
  typeInformation: "8ca73668b11fb2bdda5000e3bc287963f704463a",
  typeList: "eca9003b36799c5a80c5995d0c8d7263928b6420",
  typeNotification_StateDefault: "eebaf1aee67f1484c7068435ca0ad8f6b96b51a9",
  typePage_StateDefault: "5d48acfaf1f3d094e8d48456ff5dcfabe62551e4",
  typeSpa: "5a14e01ffb3c1e3d7ab6be78d6f3005fe4f7246c",
  typeTextOnly: "493a9d032fbe3c433f436f17f9544cc2ce798b03",
  typeWarning_CTA_Yes: "9a927ee06b3567532b5d3f39463ab8c30b346cc7",
  u_List_Panel: "737206d5c550d79d57d659bb7e20a02d17cc671d",
  undo: "8cc415f44558b49253033e33a8f38dc38bf63aa4",
  user_05a: "17a1a50680187f46c7241c1d8223060f280458c1",
  user_Profile_Panel: "0ee61a5db9bbf7e1aecab454f46b5a9b83e62cbf",
  userPermissionInfo: "abbab24d99d56492cd6517db81b7ef250d04763f",
  value_90: "894a059d66100ef3edf6885655f19e1e380fbd5f",
  webTabs: "80389c29b6b3f20aedd4a989c21ad1d51b2414ab",
  weekday: "83b203e185515400bbd2316ee53ea366fe976c64",
  wrong: "af474e55faf2cbc67d57872595eb7e9273934d21"
};

// ============================================================
// Named Component Registry
// Maps human-readable paths to Figma component keys.
// Usage in JSON: "componentRef": "buttons/primary/small"
// ============================================================
var COMPONENT_REGISTRY = {
  "buttons/primary/small":  "310bcca2715e0b81e21cd58fc67af44339c8c847",
  "buttons/secondary/small": "094db23ddfe841a00636bf2b03dc828d37dec762",
  "buttons/link/small":     "c2c80910b7ac372457a46ca787d25449a83ec308",
  "buttons/link/medium":    "aacea6f05d7f25db1672cf4a0d3dbead1f1bf119",
  "icons/arrowOut":         "6a8b08631d23d998659f26baea327d926eab8c03",
  "icons/arrowDown":        "8c4ad3c79e078ccef0ef29ddc9867569cee14544",
  "icons/arrowLeft":        "9ad9f3db0beebc8878f43cb6c098c13d9117bc7e",
  "icons/arrowRight":       "2f36f5fcd8c0dec85bb271b7fb55cb8d55ac63c8",
  "icons/arrowUp":          "2f0041e1ba23729cc61404681adcdb136a39919d",
  "icons/chevronDown":      "1724cadae6626d0d78ccbd84b0ee98b9c59e71f6",
  "icons/chevronLeft":      "cafe9b417b8dd036ec99f1d331735f6d3baf124c",
  "icons/chevronRight":     "0e6e35a3b62d8ba873a5490440e5a09dd3a1336c",
  "icons/accommodation":    "2a05cf3bfe29d3b2fd5c52d533ad6cea5d5a1f61",
  "cardHeading":            "62311d193bef1cb4a08dae085bf58ef2ee704f4e"
};

/**
 * Resolve a component reference to a Figma key.
 * Accepts:
 *   - Named ref: "buttons/primary/small" → looks up COMPONENT_REGISTRY
 *   - COMPONENT_KEYS name: "arrowsArrowOut" → looks up COMPONENT_KEYS
 *   - Raw hash: "310bcca27..." → returns as-is
 */
function resolveComponentKey(ref) {
  if (!ref) return null;
  // 1. Named registry path
  if (COMPONENT_REGISTRY[ref]) return COMPONENT_REGISTRY[ref];
  // 2. Legacy COMPONENT_KEYS name
  if (COMPONENT_KEYS[ref]) return COMPONENT_KEYS[ref];
  // 3. Assume raw hash
  return ref;
}

var COLOR_VARS = {};
var TEXT_STYLE_MAP = {};
var bodyFont = "Inter";
var displayFont = "Inter";

// HEX matching for variable discovery
var HEX_MAP = { "000000": "textPrimary", "71706f": "textSecondary", "5a0032": "textLink", "ffffff": "cardBg", "ebe9e7": "borderLight", "f7f5f3": "varmGrey", "d8d4d0": "borderMedium", "fdf0ef": "selectionBg", "fc5e58": "selectionAccent", "2d8541": "statusGreen", "c52924": "statusRed", "3b82f6": "statusBlue", "e5a100": "statusYellow" };

// Helper: append child and set fill width (avoids the "must be auto-layout child" error)
function appendFill(parent, child) {
  parent.appendChild(child);
  child.layoutSizingHorizontal = "FILL";
  return child;
}

function rgbToHex(r, g, b) {
  function h(c) { var s = Math.round(c * 255).toString(16); return s.length === 1 ? "0" + s : s; }
  return (h(r) + h(g) + h(b)).toLowerCase();
}

async function discoverVariables() {
  var VAR_SEARCH_MAP = {
    textPrimary:   ["text/primary", "text-primary", "text/default", "foreground/default", "foreground/primary", "content/primary"],
    textSecondary: ["text/secondary", "text-secondary", "foreground/secondary", "content/secondary", "text/muted"],
    textLink:      ["text/link", "text/brand", "text/accent", "brand/primary", "accent", "link"],
    cardBg:        ["surface/primary", "surface/default", "bg/card", "background/card", "surface/card", "bg/primary", "background/primary", "surface", "background/default"],
    borderLight:   ["border/default", "border/light", "border/primary", "stroke/default", "border", "divider", "separator"],
    varmGrey:        ["surface/secondary", "bg/secondary", "background/secondary", "surface/muted", "bg/muted"],
    pageBg:          ["surface/page", "bg/page", "background/page", "page"],
    borderMedium:    ["border/medium", "border/active", "border/strong", "stroke/medium"],
    selectionBg:     ["selection/bg", "selection/background", "selected/bg", "highlight/bg"],
    selectionAccent: ["selection/accent", "selection/indicator", "active/indicator", "accent/red"],
    statusGreen:     ["status/green", "status/success", "success", "success/default", "positive", "green", "check-in", "arrival"],
    statusGreenBg:   ["status/green/bg", "success/bg", "success/background"],
    statusGreenText: ["status/green/text", "success/text", "success/foreground"],
    statusRed:       ["status/red", "status/error", "error", "error/default", "negative", "red", "danger", "check-out", "departure"],
    statusRedBg:     ["status/red/bg", "error/bg", "error/background"],
    statusRedText:   ["status/red/text", "error/text", "error/foreground"],
    statusBlue:      ["status/blue", "status/info", "info", "info/default", "blue", "accent/blue", "in-stay"],
    statusYellow:    ["status/yellow", "status/warning", "warning", "warning/default", "caution"]
  };

  try {
    var vars = figma.variables.getLocalVariables("COLOR");
    console.log("Found " + vars.length + " color variables total");

    // Pass 1: Exact name match (most reliable)
    for (var token in VAR_SEARCH_MAP) {
      var searches = VAR_SEARCH_MAP[token];
      for (var s = 0; s < searches.length; s++) {
        if (COLOR_VARS[token]) break;
        for (var i = 0; i < vars.length; i++) {
          var n = vars[i].name.toLowerCase().replace(/\s+/g, "");
          if (n === searches[s] || n.endsWith("/" + searches[s]) || n.endsWith("/" + searches[s].split("/").pop())) {
            COLOR_VARS[token] = vars[i];
            console.log("✓ " + token + " → " + vars[i].name + " (name match: " + searches[s] + ")");
            break;
          }
        }
      }
    }

    // Pass 2: Partial name match (substring)
    for (var token2 in VAR_SEARCH_MAP) {
      if (COLOR_VARS[token2]) continue;
      var searches2 = VAR_SEARCH_MAP[token2];
      for (var s2 = 0; s2 < searches2.length; s2++) {
        if (COLOR_VARS[token2]) break;
        for (var j = 0; j < vars.length; j++) {
          var n2 = vars[j].name.toLowerCase();
          if (n2.indexOf(searches2[s2]) !== -1) {
            COLOR_VARS[token2] = vars[j];
            console.log("✓ " + token2 + " → " + vars[j].name + " (partial: " + searches2[s2] + ")");
            break;
          }
        }
      }
    }

    // Pass 3: Hex fallback for anything still missing
    for (var k = 0; k < vars.length; k++) {
      var v = vars[k];
      var modeIds = Object.keys(v.valuesByMode);
      if (modeIds.length > 0) {
        var val = v.valuesByMode[modeIds[0]];
        if (val && typeof val === "object" && "r" in val) {
          var hex = rgbToHex(val.r, val.g, val.b);
          if (HEX_MAP[hex] && !COLOR_VARS[HEX_MAP[hex]]) {
            COLOR_VARS[HEX_MAP[hex]] = v;
            console.log("✓ " + HEX_MAP[hex] + " → " + v.name + " (hex: #" + hex + ")");
          }
        }
      }
    }

    // Log results
    var matched = Object.keys(COLOR_VARS);
    console.log("Matched " + matched.length + "/6 color tokens: " + matched.join(", "));
    var missing = [];
    for (var t in VAR_SEARCH_MAP) { if (!COLOR_VARS[t]) missing.push(t); }
    if (missing.length > 0) console.log("✗ Missing: " + missing.join(", "));
  } catch (e) { console.log("Variable discovery failed:", e); }
}

async function discoverTextStyles() {
  try {
    var styles = figma.getLocalTextStyles();
    for (var i = 0; i < styles.length; i++) {
      var s = styles[i];
      var key = s.fontSize + "_" + s.fontName.style.toLowerCase();
      if (!TEXT_STYLE_MAP[key]) TEXT_STYLE_MAP[key] = s.id;
      var nm = s.name.toLowerCase();
      if (nm.indexOf("heading") !== -1) TEXT_STYLE_MAP["heading_" + s.fontSize] = s.id;
      if (nm.indexOf("label") !== -1 || nm.indexOf("caption") !== -1) TEXT_STYLE_MAP["label_" + s.fontSize] = s.id;
      if (nm.indexOf("body") !== -1 || nm.indexOf("paragraph") !== -1) TEXT_STYLE_MAP["body_" + s.fontSize] = s.id;
    }
    console.log("Matched " + Object.keys(TEXT_STYLE_MAP).length + " text style keys");
  } catch (e) { console.log("Text style discovery failed:", e); }
}

function solidFill(color, tokenName) {
  var paint = { type: "SOLID", color: color, opacity: 1 };
  if (tokenName && COLOR_VARS[tokenName]) {
    try { return [figma.variables.setBoundVariableForPaint(paint, "color", COLOR_VARS[tokenName])]; }
    catch (e) { /* fallback */ }
  }
  return [paint];
}

function applyTextStyle(node, size, weight, role) {
  var keys = [role + "_" + size, size + "_" + (weight || "regular"), size + "_regular", size + "_medium"];
  for (var i = 0; i < keys.length; i++) {
    if (TEXT_STYLE_MAP[keys[i]]) { node.textStyleId = TEXT_STYLE_MAP[keys[i]]; return; }
  }
}

async function loadFonts() {
  var families = ["Strawberry Sans Display", "Strawberry Sans Text", "Outfit", "Inter"];
  for (var i = 0; i < families.length; i++) {
    try { await figma.loadFontAsync({ family: families[i], style: "Regular" }); if (i <= 1) { if (i === 0) displayFont = families[i]; else bodyFont = families[i]; } }
    catch (e) { /* skip */ }
  }
  try { await figma.loadFontAsync({ family: displayFont, style: "Bold" }); } catch (e) {
    try { await figma.loadFontAsync({ family: displayFont, style: "SemiBold" }); } catch (e2) { /* skip */ }
  }
  if (bodyFont === "Inter") { try { await figma.loadFontAsync({ family: "Inter", style: "Regular" }); } catch (e) { /* skip */ } }
  if (displayFont === "Inter") { try { await figma.loadFontAsync({ family: "Inter", style: "Bold" }); } catch (e) { /* skip */ } }
}

async function importInfoIcon() {
  try {
    var comp = await figma.importComponentByKeyAsync(COMPONENT_KEYS.alertInfo);
    var inst = comp.createInstance();
    inst.name = "info-icon";
    inst.resize(20, 20);
    return inst;
  } catch (e) {
    var f = figma.createFrame(); f.name = "info-icon"; f.resize(16, 16); f.cornerRadius = 8;
    f.fills = solidFill(TOKENS.colors.textSecondary); return f;
  }
}

// === BUILD FUNCTIONS ===

async function buildText(text, size, weight, color, tokenName, role) {
  var t = figma.createText();
  var w = weight || "Regular";
  try { t.fontName = { family: w === "Bold" ? displayFont : bodyFont, style: w }; }
  catch (e) { t.fontName = { family: "Inter", style: "Regular" }; }
  t.characters = text || "–";
  t.fontSize = size;
  t.fills = solidFill(color || TOKENS.colors.textPrimary, tokenName || "textPrimary");
  applyTextStyle(t, size, w.toLowerCase(), role || "body");
  return t;
}

async function buildLabelRow(label, hasInfo) {
  var row = figma.createFrame();
  row.name = "label-row";
  row.layoutMode = "HORIZONTAL";
  row.itemSpacing = 4;
  row.counterAxisAlignItems = "CENTER";
  row.primaryAxisSizingMode = "AUTO";
  row.counterAxisSizingMode = "AUTO";
  row.fills = [];

  var labelNode = await buildText(label, 12, "Regular", TOKENS.colors.textSecondary, "textSecondary", "label");
  labelNode.name = "field-label";
  row.appendChild(labelNode);

  if (hasInfo) {
    var icon = await importInfoIcon();
    row.appendChild(icon);
  }
  return row;
}

async function buildField(fieldDef) {
  var field = figma.createFrame();
  field.name = "field / " + (fieldDef.label || "field");
  field.layoutMode = "VERTICAL";
  field.itemSpacing = TOKENS.spacing.sm;
  field.primaryAxisSizingMode = "AUTO";
  field.counterAxisSizingMode = "AUTO";
  field.fills = [];

  var labelRow = await buildLabelRow(fieldDef.label, fieldDef.hasInfo);
  field.appendChild(labelRow);

  var isLink = fieldDef.isLink || fieldDef.fieldType === "link";
  var valueNode = await buildText(
    fieldDef.value, 16, "Regular",
    isLink ? TOKENS.colors.textLink : TOKENS.colors.textPrimary,
    isLink ? "textLink" : "textPrimary",
    isLink ? "link" : "body"
  );
  if (isLink) valueNode.textDecoration = "UNDERLINE";
  valueNode.name = isLink ? "field-value-link" : "field-value";
  field.appendChild(valueNode);

  return field;
}

// ============================================================
// Build: Card Heading with Action Button + Accent Line (Option 8)
// Heading row: [icon + title] ... [Primary button]
// Then a 3px red accent line below
// ============================================================
async function buildCardHeadingWithAction(section) {
  var wrapper = figma.createFrame();
  wrapper.name = "Card Heading + Action";
  wrapper.layoutMode = "VERTICAL";
  wrapper.primaryAxisSizingMode = "AUTO";
  wrapper.counterAxisSizingMode = "FIXED";
  wrapper.resize(TOKENS.layout.contentWidth, 60);
  wrapper.fills = [];
  wrapper.itemSpacing = 0;

  // Heading row
  var row = figma.createFrame();
  row.name = "heading-row";
  row.layoutMode = "HORIZONTAL";
  row.primaryAxisSizingMode = "FIXED";
  row.counterAxisSizingMode = "AUTO";
  row.resize(TOKENS.layout.contentWidth, 48);
  row.paddingLeft = row.paddingRight = 24;
  row.paddingTop = row.paddingBottom = 12;
  row.fills = solidFill(TOKENS.colors.varmGrey, "varmGrey");
  row.primaryAxisAlignItems = "SPACE_BETWEEN";
  row.counterAxisAlignItems = "CENTER";
  row.cornerRadius = TOKENS.layout.cardRadius;

  // Left side: icon + title
  var leftGroup = figma.createFrame();
  leftGroup.name = "heading-left";
  leftGroup.layoutMode = "HORIZONTAL";
  leftGroup.itemSpacing = 10;
  leftGroup.primaryAxisSizingMode = "AUTO";
  leftGroup.counterAxisSizingMode = "AUTO";
  leftGroup.fills = [];
  leftGroup.counterAxisAlignItems = "CENTER";

  // Try to add the accommodation icon
  if (section.icon) {
    var iconKey = resolveComponentKey("icons/" + section.icon) || COMPONENT_KEYS["typeAccommodation"] || COMPONENT_KEYS[section.icon];
    if (iconKey) {
      try {
        var iconComp = await figma.importComponentByKeyAsync(iconKey);
        var iconInst = iconComp.createInstance();
        iconInst.name = "heading-icon";
        iconInst.resize(20, 20);
        leftGroup.appendChild(iconInst);
      } catch (e) { /* icon import failed */ }
    }
  }

  var titleText = await buildText(section.title || "Accommodation", 16, "SemiBold", TOKENS.colors.textPrimary, "textPrimary", "heading");
  titleText.name = "heading-title";
  leftGroup.appendChild(titleText);
  row.appendChild(leftGroup);

  // Right side: Primary action button from design system
  if (section.action) {
    var actionBtn = await buildPrimaryActionButton(section.action);
    row.appendChild(actionBtn);
  }

  wrapper.appendChild(row);

  // Accent line (3px red strip)
  if (section.accentLine) {
    var accent = figma.createFrame();
    accent.name = "accent-line";
    accent.layoutMode = "NONE";
    accent.resize(TOKENS.layout.contentWidth, 3);
    var accentColor = section.accentColor ? hexToRgb(section.accentColor.replace("#", "")) : hexToRgb("960014");
    accent.fills = [{ type: "SOLID", color: accentColor, opacity: 1 }];
    wrapper.appendChild(accent);
    accent.layoutSizingHorizontal = "FILL";
  }

  return wrapper;
}

// ============================================================
// Build: Primary Action Button (Go to booking, Book table, etc.)
// Uses actual Figma design system Buttons component.
// ============================================================
async function buildPrimaryActionButton(section) {
  var wrapper = figma.createFrame();
  wrapper.name = "Primary Action CTA";
  wrapper.layoutMode = "HORIZONTAL";
  wrapper.primaryAxisSizingMode = "AUTO";
  wrapper.counterAxisSizingMode = "AUTO";
  wrapper.fills = [];
  wrapper.paddingLeft = wrapper.paddingRight = 0;
  wrapper.paddingTop = 8;
  wrapper.paddingBottom = 0;

  // Resolve component key — supports "buttons/primary/small" refs or raw hashes
  var componentKey = resolveComponentKey(section.componentRef || section.componentKey) || COMPONENT_KEYS.buttons;

  try {
    var btnComp = await figma.importComponentByKeyAsync(componentKey);
    var btnInstance = btnComp.createInstance();
    btnInstance.name = section.label || "Go to booking";

    // Set component properties using the actual property IDs
    // Figma property names include internal IDs like "Label#1234:0"
    if (section.properties) {
      try {
        var compProps = btnInstance.componentProperties;
        var propsToSet = {};
        for (var propKey in compProps) {
          // Match by the display name (before the # separator)
          var displayName = propKey.split("#")[0];
          if (displayName === "Label" && section.properties.Label) {
            propsToSet[propKey] = section.properties.Label;
          }
          if (displayName === "Icon right" && section.properties["Icon right"] !== undefined) {
            propsToSet[propKey] = section.properties["Icon right"];
          }
          if (displayName === "Icon left" && section.properties["Icon left"] !== undefined) {
            propsToSet[propKey] = section.properties["Icon left"];
          }
        }
        if (Object.keys(propsToSet).length > 0) {
          btnInstance.setProperties(propsToSet);
        }
      } catch (e) {
        // Fallback: directly find and update the text node
        var textNode = btnInstance.findOne(function(node) {
          return node.type === "TEXT";
        });
        if (textNode) {
          await loadFonts();
          textNode.characters = section.properties.Label || section.label || "Go to booking";
        }
      }
    }

    // If Icon right is enabled and we have an icon key, try to swap the icon instance
    var iconKey = resolveComponentKey(section.iconRef || section.iconRightKey);
    if (iconKey) {
      try {
        var iconComp = await figma.importComponentByKeyAsync(iconKey);
        // Find the icon slot inside the button instance
        var iconSlot = btnInstance.findOne(function(node) {
          return node.type === "INSTANCE" && (
            node.name.toLowerCase().includes("icon") ||
            node.name.toLowerCase().includes("arrow") ||
            node.name.toLowerCase().includes("right")
          );
        });
        if (iconSlot && iconSlot.type === "INSTANCE") {
          iconSlot.swapComponent(iconComp);
        }
      } catch (e) { /* icon swap failed, keep default */ }
    }

    wrapper.appendChild(btnInstance);
  } catch (e) {
    // Fallback: build a manual primary button if component import fails
    var btn = figma.createFrame();
    btn.name = section.label || "Go to booking";
    btn.layoutMode = "HORIZONTAL";
    btn.itemSpacing = 4;
    btn.primaryAxisSizingMode = "AUTO";
    btn.counterAxisSizingMode = "AUTO";
    btn.paddingTop = btn.paddingBottom = 4;
    btn.paddingLeft = btn.paddingRight = 8;
    btn.cornerRadius = 8;
    btn.fills = [{ type: "SOLID", color: hexToRgb("960014"), opacity: 1 }];
    btn.primaryAxisAlignItems = "CENTER";
    btn.counterAxisAlignItems = "CENTER";

    var label = await buildText(section.label || "Go to booking", 14, "SemiBold", { r: 1, g: 1, b: 1 }, null, "body");
    label.name = "btn-label";
    btn.appendChild(label);

    wrapper.appendChild(btn);
  }

  return wrapper;
}

// ============================================================
// Build: Booking Meta Row (booking number + source)
// ============================================================
async function buildBookingMeta(section) {
  var row = figma.createFrame();
  row.name = "Booking Meta";
  row.layoutMode = "HORIZONTAL";
  row.itemSpacing = 12;
  row.primaryAxisSizingMode = "AUTO";
  row.counterAxisSizingMode = "AUTO";
  row.fills = [];
  row.counterAxisAlignItems = "CENTER";

  // Booking number badge
  var badge = figma.createFrame();
  badge.name = "booking-number-badge";
  badge.layoutMode = "HORIZONTAL";
  badge.primaryAxisSizingMode = "AUTO";
  badge.counterAxisSizingMode = "AUTO";
  badge.paddingTop = badge.paddingBottom = 4;
  badge.paddingLeft = badge.paddingRight = 12;
  badge.cornerRadius = 24;
  badge.fills = solidFill(TOKENS.colors.cardBg, "cardBg");
  badge.strokes = [{ type: "SOLID", color: TOKENS.colors.borderLight, opacity: 1 }];
  badge.strokeWeight = 1;

  var numText = await buildText("Booking number: " + (section.bookingNumber || "–"), 12, "Medium", TOKENS.colors.textPrimary, "textPrimary", "label");
  numText.name = "booking-number";
  badge.appendChild(numText);
  row.appendChild(badge);

  // Separator
  var sep = await buildText("|", 14, "Regular", TOKENS.colors.borderMedium, "borderMedium", "body");
  sep.name = "separator";
  row.appendChild(sep);

  // Source label
  var sourceText = await buildText(section.source || "App", 14, "Regular", TOKENS.colors.textSecondary, "textSecondary", "body");
  sourceText.name = "booking-source";
  row.appendChild(sourceText);

  return row;
}

async function buildGridCard(section) {
  var card = figma.createFrame();
  card.name = "Card";
  card.layoutMode = "VERTICAL";
  card.paddingTop = card.paddingBottom = card.paddingLeft = card.paddingRight = TOKENS.layout.cardPadding;
  card.primaryAxisSizingMode = "AUTO";
  card.counterAxisSizingMode = "FIXED";
  card.resize(TOKENS.layout.contentWidth, 400);
  card.cornerRadius = TOKENS.layout.cardRadius;
  card.fills = solidFill(TOKENS.colors.cardBg, "cardBg");
  card.effects = [{ type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 0.04 }, offset: { x: 0, y: 1 }, radius: 4, spread: 0, visible: true, blendMode: "NORMAL" }];

  var grid = figma.createFrame();
  grid.name = "card-grid";
  grid.layoutMode = "HORIZONTAL";
  grid.itemSpacing = TOKENS.layout.gridGap;
  grid.primaryAxisSizingMode = "AUTO";
  grid.counterAxisSizingMode = "AUTO";
  grid.fills = [];

  var columns = section.columns || [];
  for (var c = 0; c < columns.length; c++) {
    var col = figma.createFrame();
    col.name = columns[c].name || ("Column " + (c + 1));
    col.layoutMode = "VERTICAL";
    col.itemSpacing = TOKENS.layout.fieldGap;
    col.primaryAxisSizingMode = "AUTO";
    col.counterAxisSizingMode = "FIXED";
    col.resize(TOKENS.layout.colWidth, 200);
    col.fills = [];

    var fields = columns[c].fields || [];
    for (var f = 0; f < fields.length; f++) {
      var fieldFrame = await buildField(fields[f]);
      col.appendChild(fieldFrame);
      fieldFrame.layoutSizingHorizontal = "FILL";
      fieldFrame.layoutSizingVertical = "HUG";
    }
    grid.appendChild(col);
  }

  card.appendChild(grid);

  // Render action button inside the card if defined
  if (section.action && section.action.type === "primary-action-button") {
    var actionBtn = await buildPrimaryActionButton(section.action);
    card.appendChild(actionBtn);
  }

  return card;
}

async function buildDataTable(section) {
  var wrapper = figma.createFrame();
  wrapper.name = "Data Table";
  wrapper.layoutMode = "VERTICAL";
  wrapper.primaryAxisSizingMode = "AUTO";
  wrapper.counterAxisSizingMode = "FIXED";
  wrapper.resize(TOKENS.layout.contentWidth, 200);
  wrapper.cornerRadius = TOKENS.layout.cardRadius;
  wrapper.fills = solidFill(TOKENS.colors.cardBg, "cardBg");
  wrapper.effects = [{ type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 0.04 }, offset: { x: 0, y: 1 }, radius: 4, spread: 0, visible: true, blendMode: "NORMAL" }];

  // Header row
  if (section.headers && section.headers.length > 0) {
    var headerRow = figma.createFrame();
    headerRow.name = "table-header";
    headerRow.layoutMode = "HORIZONTAL";
    headerRow.primaryAxisSizingMode = "FIXED";
    headerRow.counterAxisSizingMode = "AUTO";
    headerRow.resize(TOKENS.layout.contentWidth, 40);
    headerRow.paddingLeft = headerRow.paddingRight = 24;
    headerRow.paddingTop = headerRow.paddingBottom = 12;
    headerRow.fills = solidFill(TOKENS.colors.varmGrey, "varmGrey");

    for (var h = 0; h < section.headers.length; h++) {
      var th = await buildText(section.headers[h], 12, "Regular", TOKENS.colors.textSecondary, "textSecondary", "label");
      th.layoutSizingHorizontal = "FILL";
      headerRow.appendChild(th);
    }
    wrapper.appendChild(headerRow);
  }

  return wrapper;
}

// Build: Top Stats Card (Arrivals, Departures, Stayovers, In-stay Visits)
function hexToRgb(hex) {
  hex = hex.replace("#", "");
  return {
    r: parseInt(hex.substring(0, 2), 16) / 255,
    g: parseInt(hex.substring(2, 4), 16) / 255,
    b: parseInt(hex.substring(4, 6), 16) / 255
  };
}

async function buildTopStatsCard(section) {
  var card = figma.createFrame();
  card.name = "Dashboard Top Card";
  card.layoutMode = "VERTICAL";
  card.paddingTop = card.paddingBottom = 16;
  card.paddingLeft = card.paddingRight = 24;
  card.itemSpacing = 16;
  card.primaryAxisSizingMode = "AUTO";
  card.counterAxisSizingMode = "FIXED";
  card.resize(TOKENS.layout.contentWidth, 300);
  card.cornerRadius = TOKENS.layout.cardRadius;
  card.fills = solidFill(TOKENS.colors.cardBg, "cardBg");
  card.effects = [{ type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 0.04 }, offset: { x: 0, y: 1 }, radius: 4, spread: 0, visible: true, blendMode: "NORMAL" }];

  // Stats row
  var statsRow = figma.createFrame();
  statsRow.name = "stats-row";
  statsRow.layoutMode = "HORIZONTAL";
  statsRow.itemSpacing = 40;
  statsRow.counterAxisAlignItems = "CENTER";
  statsRow.primaryAxisSizingMode = "AUTO";
  statsRow.counterAxisSizingMode = "AUTO";
  statsRow.fills = [];

  var stats = section.stats || [];
  for (var i = 0; i < stats.length; i++) {
    // Add divider between stats
    if (i > 0) {
      var divV = figma.createFrame();
      divV.name = "divider-v";
      divV.resize(1, 88);
      divV.fills = solidFill(TOKENS.colors.borderLight, "borderLight");
      statsRow.appendChild(divV);
    }

    var stat = stats[i];
    var statFrame = figma.createFrame();
    statFrame.name = "stat / " + stat.label;
    statFrame.layoutMode = "VERTICAL";
    statFrame.itemSpacing = 16;
    statFrame.paddingTop = statFrame.paddingBottom = 16;
    statFrame.paddingLeft = statFrame.paddingRight = 16;
    statFrame.primaryAxisSizingMode = "AUTO";
    statFrame.counterAxisSizingMode = "AUTO";
    statFrame.fills = [];

    // Header row (label+count left, icon right) - FILL width
    var headerRow = figma.createFrame();
    headerRow.name = "stat-header";
    headerRow.layoutMode = "HORIZONTAL";
    headerRow.primaryAxisAlignItems = "SPACE_BETWEEN";
    headerRow.counterAxisAlignItems = "CENTER";
    headerRow.primaryAxisSizingMode = "AUTO";
    headerRow.counterAxisSizingMode = "AUTO";
    headerRow.fills = [];

    // Info column (label + count)
    var infoCol = figma.createFrame();
    infoCol.name = "stat-info";
    infoCol.layoutMode = "VERTICAL";
    infoCol.itemSpacing = 8;
    infoCol.primaryAxisSizingMode = "AUTO";
    infoCol.counterAxisSizingMode = "AUTO";
    infoCol.fills = [];

    var labelText = await buildText(stat.label, 14, "Regular", TOKENS.colors.textSecondary, "textSecondary", "label");
    infoCol.appendChild(labelText);

    var countText = await buildText(stat.count, 32, "Bold", TOKENS.colors.textPrimary, "textPrimary", "heading");
    infoCol.appendChild(countText);

    headerRow.appendChild(infoCol);

    // Icon circle with design system component instance
    var ICON_COMPONENT_KEYS = {
      "check-in":    COMPONENT_KEYS.hotelCheckin,
      "check-out":   COMPONENT_KEYS.hotelCheckout,
      "stayover":    COMPONENT_KEYS.hotelAccommodation,
      "in-stay":     COMPONENT_KEYS.hotelAccommodation
    };

    var iconCircle = figma.createFrame();
    iconCircle.name = "icon-" + stat.label.toLowerCase().replace(/\s/g, "-");
    iconCircle.resize(40, 40);
    iconCircle.cornerRadius = 20;
    iconCircle.clipsContent = false;

    if (stat.iconBgToken && COLOR_VARS[stat.iconBgToken]) {
      var bgPaint = { type: "SOLID", color: TOKENS.colors[stat.iconBgToken] || { r: 0.5, g: 0.5, b: 0.5 }, opacity: 0.1 };
      try {
        iconCircle.fills = [figma.variables.setBoundVariableForPaint(bgPaint, "color", COLOR_VARS[stat.iconBgToken])];
        iconCircle.fills[0].opacity = 0.1;
      } catch (e) { iconCircle.fills = [bgPaint]; }
    } else if (stat.iconBg) {
      var bgMatch = stat.iconBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)/);
      if (bgMatch) {
        iconCircle.fills = [{ type: "SOLID", color: { r: parseInt(bgMatch[1])/255, g: parseInt(bgMatch[2])/255, b: parseInt(bgMatch[3])/255 }, opacity: parseFloat(bgMatch[4] || 1) }];
      }
    }

    // Place icon component instance inside circle
    var iconKey = stat.iconComponentKey || (ICON_COMPONENT_KEYS[stat.icon] || "");
    if (iconKey) {
      try {
        var iconComp = await figma.importComponentByKeyAsync(iconKey);
        var iconInstance = iconComp.createInstance();
        iconInstance.resize(20, 20);
        iconInstance.x = 9.67;
        iconInstance.y = 10;
        iconCircle.appendChild(iconInstance);
        console.log("✓ Icon instance placed: " + stat.icon + " → " + iconComp.name);
      } catch (e) { console.log("✗ Icon import error for " + stat.icon + ": " + e.message); }
    }

    headerRow.appendChild(iconCircle);
    statFrame.appendChild(headerRow);
    headerRow.layoutSizingHorizontal = "FILL";

    // Progress bar (if present)
    if (stat.progressPercent !== undefined && stat.progressColor) {
      var progressTrack = figma.createFrame();
      progressTrack.name = "progress-track";
      progressTrack.resize(300, 4);
      progressTrack.cornerRadius = 2;
      progressTrack.fills = solidFill(TOKENS.colors.borderLight, "borderLight");
      progressTrack.layoutMode = "HORIZONTAL";
      progressTrack.primaryAxisSizingMode = "FIXED";
      progressTrack.counterAxisSizingMode = "FIXED";

      var progressBar = figma.createFrame();
      progressBar.name = "progress-bar";
      var barWidth = Math.round(300 * stat.progressPercent / 100);
      progressBar.resize(barWidth, 4);
      progressBar.cornerRadius = 2;
      if (stat.progressToken && COLOR_VARS[stat.progressToken]) {
        progressBar.fills = solidFill(hexToRgb(stat.progressColor), stat.progressToken);
      } else {
        progressBar.fills = [{ type: "SOLID", color: hexToRgb(stat.progressColor) }];
      }
      progressTrack.appendChild(progressBar);

      statFrame.appendChild(progressTrack);
    }

    // Subtitle
    var subText = await buildText(stat.subtitle, 14, "Regular", TOKENS.colors.textSecondary, "textSecondary", "body");
    statFrame.appendChild(subText);

    statsRow.appendChild(statFrame);
    statFrame.layoutSizingHorizontal = "FILL";
  }

  card.appendChild(statsRow);
  statsRow.layoutSizingHorizontal = "FILL";

  // Horizontal divider
  var divH = figma.createFrame();
  divH.name = "divider-h";
  divH.resize(TOKENS.layout.contentWidth - 48, 1);
  divH.fills = solidFill(TOKENS.colors.borderLight, "borderLight");
  card.appendChild(divH);
  divH.layoutSizingHorizontal = "FILL";

  // Extras row
  var extras = section.extras || [];
  if (extras.length > 0) {
    var extrasRow = figma.createFrame();
    extrasRow.name = "extras-row";
    extrasRow.layoutMode = "HORIZONTAL";
    extrasRow.primaryAxisAlignItems = "SPACE_BETWEEN";
    extrasRow.counterAxisAlignItems = "CENTER";
    extrasRow.primaryAxisSizingMode = "FIXED";
    extrasRow.counterAxisSizingMode = "AUTO";
    extrasRow.resize(TOKENS.layout.contentWidth - 48, 32);
    extrasRow.paddingLeft = extrasRow.paddingRight = 8;
    extrasRow.fills = [];

    // Left group
    var leftGroup = figma.createFrame();
    leftGroup.name = "extras-left";
    leftGroup.layoutMode = "HORIZONTAL";
    leftGroup.itemSpacing = 8;
    leftGroup.counterAxisAlignItems = "CENTER";
    leftGroup.primaryAxisSizingMode = "AUTO";
    leftGroup.counterAxisSizingMode = "AUTO";
    leftGroup.fills = [];

    for (var e = 0; e < extras.length; e++) {
      var ex = extras[e];
      if (ex.position === "right") continue;

      var extraItem = figma.createFrame();
      extraItem.name = "extra-" + ex.label;
      extraItem.layoutMode = "HORIZONTAL";
      extraItem.itemSpacing = 8;
      extraItem.counterAxisAlignItems = "CENTER";
      extraItem.paddingTop = extraItem.paddingBottom = 6;
      extraItem.paddingLeft = extraItem.paddingRight = 8;
      extraItem.primaryAxisSizingMode = "AUTO";
      extraItem.counterAxisSizingMode = "AUTO";
      extraItem.fills = [];

      var exLabel = await buildText(ex.label, 14, "Regular", TOKENS.colors.textSecondary, "textSecondary", "body");
      extraItem.appendChild(exLabel);

      var exValue = await buildText(ex.value, 16, "Bold", TOKENS.colors.textPrimary, "textPrimary", "heading");
      extraItem.appendChild(exValue);

      leftGroup.appendChild(extraItem);
    }
    extrasRow.appendChild(leftGroup);

    // Right items
    for (var e2 = 0; e2 < extras.length; e2++) {
      var ex2 = extras[e2];
      if (ex2.position !== "right") continue;

      var rightItem = figma.createFrame();
      rightItem.name = "extra-" + ex2.label;
      rightItem.layoutMode = "HORIZONTAL";
      rightItem.itemSpacing = 8;
      rightItem.counterAxisAlignItems = "CENTER";
      rightItem.paddingTop = rightItem.paddingBottom = 6;
      rightItem.paddingLeft = rightItem.paddingRight = 8;
      rightItem.primaryAxisSizingMode = "AUTO";
      rightItem.counterAxisSizingMode = "AUTO";
      rightItem.fills = [];

      var rLabel = await buildText(ex2.label, 14, "Regular", TOKENS.colors.textSecondary, "textSecondary", "body");
      rightItem.appendChild(rLabel);

      if (ex2.type === "badge") {
        var badge = figma.createFrame();
        badge.name = "badge";
        badge.resize(24, 24);
        badge.cornerRadius = 12;
        badge.fills = [{ type: "SOLID", color: { r: 0.976, g: 0.851, b: 0.847 } }];
        badge.counterAxisAlignItems = "CENTER";
        badge.primaryAxisAlignItems = "CENTER";
        badge.layoutMode = "HORIZONTAL";

        var badgeNum = await buildText(ex2.value, 16, "Bold", { r: 0.588, g: 0, b: 0.078 }, undefined, "label");
        badge.appendChild(badgeNum);
        rightItem.appendChild(badge);
      } else {
        var rValue = await buildText(ex2.value, 16, "Bold", TOKENS.colors.textPrimary, "textPrimary", "heading");
        rightItem.appendChild(rValue);
      }

      extrasRow.appendChild(rightItem);
    }

    card.appendChild(extrasRow);
    extrasRow.layoutSizingHorizontal = "FILL";
  }

  return card;
}

// ============================================================
// Build: Status Badge (colored pill)
// ============================================================
async function buildStatusBadge(section) {
  var badge = figma.createFrame();
  badge.name = "Status Badge";
  badge.layoutMode = "HORIZONTAL";
  badge.primaryAxisSizingMode = "AUTO";
  badge.counterAxisSizingMode = "AUTO";
  badge.paddingLeft = badge.paddingRight = 12;
  badge.paddingTop = badge.paddingBottom = 4;
  badge.cornerRadius = 24;

  var variant = section.variant || "default";
  var colorMap = {
    green:   { bg: TOKENS.colors.statusGreen, bgToken: "statusGreen", textToken: "statusGreenText" },
    red:     { bg: TOKENS.colors.statusRed,   bgToken: "statusRed",   textToken: "statusRedText" },
    blue:    { bg: TOKENS.colors.statusBlue,  bgToken: "statusBlue",  textToken: "statusBlue" },
    yellow:  { bg: TOKENS.colors.statusYellow,bgToken: "statusYellow", textToken: "statusYellow" },
    default: { bg: TOKENS.colors.textSecondary, bgToken: "textSecondary", textToken: "textSecondary" }
  };
  var c = colorMap[variant] || colorMap["default"];

  var bgPaint = { type: "SOLID", color: c.bg, opacity: 0.15 };
  if (COLOR_VARS[c.bgToken]) {
    try { bgPaint = figma.variables.setBoundVariableForPaint(bgPaint, "color", COLOR_VARS[c.bgToken]); bgPaint.opacity = 0.15; } catch(e) {}
  }
  badge.fills = [bgPaint];

  var textColor = c.bg;
  var text = await buildText(section.text || "Status", 12, "Medium", textColor, c.textToken, "label");
  badge.appendChild(text);
  return badge;
}

// ============================================================
// Build: Filter Bar
// ============================================================
async function buildFilterBar(section) {
  var bar = figma.createFrame();
  bar.name = "Filter Bar";
  bar.layoutMode = "HORIZONTAL";
  bar.itemSpacing = 24;
  bar.primaryAxisSizingMode = "AUTO";
  bar.counterAxisSizingMode = "AUTO";
  bar.paddingLeft = bar.paddingRight = 24;
  bar.paddingTop = bar.paddingBottom = 16;
  bar.fills = solidFill(TOKENS.colors.cardBg, "cardBg");
  bar.cornerRadius = TOKENS.layout.cardRadius;
  bar.effects = [{ type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 0.04 }, offset: { x: 0, y: 1 }, radius: 4, spread: 0, visible: true, blendMode: "NORMAL" }];

  var filters = section.filters || [];
  for (var f = 0; f < filters.length; f++) {
    var col = figma.createFrame();
    col.name = "filter-" + (filters[f].label || "filter");
    col.layoutMode = "VERTICAL";
    col.itemSpacing = 4;
    col.primaryAxisSizingMode = "AUTO";
    col.counterAxisSizingMode = "AUTO";
    col.fills = [];
    var lbl = await buildText(filters[f].label || "", 12, "Regular", TOKENS.colors.textSecondary, "textSecondary", "label");
    col.appendChild(lbl);
    var val = await buildText(filters[f].value || "–", 14, "Regular", TOKENS.colors.textPrimary, "textPrimary", "body");
    col.appendChild(val);
    if (filters[f].inputType === "select") {
      var ind = figma.createFrame(); ind.name = "select-line"; ind.resize(120, 1);
      ind.fills = solidFill(TOKENS.colors.borderMedium, "borderMedium");
      col.appendChild(ind);
    }
    bar.appendChild(col);
  }
  return bar;
}

// ============================================================
// Build: Teaser Card
// ============================================================
async function buildTeaserCard(section) {
  var card = figma.createFrame();
  card.name = "Teaser Card";
  card.layoutMode = "VERTICAL";
  card.itemSpacing = 12;
  card.primaryAxisSizingMode = "AUTO";
  card.counterAxisSizingMode = "FIXED";
  card.resize(320, 100);
  card.paddingTop = card.paddingBottom = 16;
  card.paddingLeft = card.paddingRight = 20;
  card.cornerRadius = TOKENS.layout.cardRadius;
  card.fills = solidFill(TOKENS.colors.cardBg, "cardBg");
  card.effects = [{ type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 0.04 }, offset: { x: 0, y: 1 }, radius: 4, spread: 0, visible: true, blendMode: "NORMAL" }];

  // Top row: icon + title
  var topRow = figma.createFrame();
  topRow.name = "teaser-top";
  topRow.layoutMode = "HORIZONTAL";
  topRow.itemSpacing = 12;
  topRow.primaryAxisSizingMode = "AUTO";
  topRow.counterAxisSizingMode = "AUTO";
  topRow.counterAxisAlignItems = "CENTER";
  topRow.fills = [];

  if (section.iconComponentKey) {
    try {
      var ic = await figma.importComponentByKeyAsync(section.iconComponentKey);
      var inst = ic.createInstance(); inst.resize(20, 20);
      topRow.appendChild(inst);
    } catch(e) {}
  }

  var title = await buildText(section.title || "Item", 16, "Medium", TOKENS.colors.textPrimary, "textPrimary", "heading");
  topRow.appendChild(title);
  card.appendChild(topRow);
  topRow.layoutSizingHorizontal = "FILL";

  // Details row
  if (section.details && section.details.length > 0) {
    var detRow = figma.createFrame();
    detRow.name = "teaser-details";
    detRow.layoutMode = "HORIZONTAL";
    detRow.itemSpacing = 24;
    detRow.primaryAxisSizingMode = "AUTO";
    detRow.counterAxisSizingMode = "AUTO";
    detRow.fills = [];
    for (var d = 0; d < section.details.length; d++) {
      var dc = figma.createFrame();
      dc.name = "detail-" + d; dc.layoutMode = "VERTICAL"; dc.itemSpacing = 2;
      dc.primaryAxisSizingMode = "AUTO"; dc.counterAxisSizingMode = "AUTO"; dc.fills = [];
      var dl = await buildText(section.details[d].label || "", 12, "Regular", TOKENS.colors.textSecondary, "textSecondary", "label");
      dc.appendChild(dl);
      var dv = await buildText(section.details[d].value || "–", 14, "Regular", TOKENS.colors.textPrimary, "textPrimary", "body");
      dc.appendChild(dv);
      detRow.appendChild(dc);
    }
    card.appendChild(detRow);
    detRow.layoutSizingHorizontal = "FILL";
  }

  if (section.badge) {
    var bdg = await buildStatusBadge(section.badge);
    card.appendChild(bdg);
  }
  return card;
}

// ============================================================
// Build: Sidebar Nav
// ============================================================
async function buildSidebarNav(section) {
  var sidebar = figma.createFrame();
  sidebar.name = "Sidebar Nav";
  sidebar.layoutMode = "VERTICAL";
  sidebar.primaryAxisSizingMode = "FIXED";
  sidebar.counterAxisSizingMode = "FIXED";
  sidebar.resize(TOKENS.layout.sidebarWidth, 900);
  sidebar.paddingTop = 16;
  sidebar.itemSpacing = 4;
  sidebar.fills = solidFill(TOKENS.colors.cardBg, "cardBg");
  sidebar.strokes = solidFill(TOKENS.colors.borderLight, "borderLight");
  sidebar.strokeWeight = 1; sidebar.strokeAlign = "INSIDE";

  var items = section.items || [];
  for (var n = 0; n < items.length; n++) {
    var ni = figma.createFrame();
    ni.name = "nav-" + (items[n].label || "item");
    ni.layoutMode = "VERTICAL";
    ni.primaryAxisAlignItems = "CENTER";
    ni.counterAxisAlignItems = "CENTER";
    ni.primaryAxisSizingMode = "AUTO";
    ni.counterAxisSizingMode = "FIXED";
    ni.resize(TOKENS.layout.sidebarWidth, 64);
    ni.itemSpacing = 4;
    ni.fills = items[n].active ? solidFill(TOKENS.colors.selectionBg, "selectionBg") : [];

    if (items[n].iconComponentKey) {
      try {
        var navIc = await figma.importComponentByKeyAsync(items[n].iconComponentKey);
        var navInst = navIc.createInstance(); navInst.resize(24, 24);
        ni.appendChild(navInst);
      } catch(e) {}
    } else {
      var ph = figma.createFrame(); ph.name = "icon"; ph.resize(24, 24);
      ph.cornerRadius = 4; ph.fills = solidFill(TOKENS.colors.textSecondary, "textSecondary"); ph.opacity = 0.3;
      ni.appendChild(ph);
    }

    var navLbl = await buildText(items[n].label || "", 10, "Regular",
      items[n].active ? TOKENS.colors.textLink : TOKENS.colors.textSecondary,
      items[n].active ? "textLink" : "textSecondary", "label");
    ni.appendChild(navLbl);
    sidebar.appendChild(ni);
  }
  return sidebar;
}

// ============================================================
// Build: Top Header
// ============================================================
async function buildTopHeader(section) {
  var header = figma.createFrame();
  header.name = "Top Header";
  header.layoutMode = "HORIZONTAL";
  header.primaryAxisAlignItems = "SPACE_BETWEEN";
  header.counterAxisAlignItems = "CENTER";
  header.primaryAxisSizingMode = "FIXED";
  header.counterAxisSizingMode = "FIXED";
  header.resize(TOKENS.layout.contentWidth, TOKENS.layout.headerHeight);
  header.paddingLeft = header.paddingRight = 24;
  header.fills = solidFill(TOKENS.colors.cardBg, "cardBg");
  header.strokes = solidFill(TOKENS.colors.borderLight, "borderLight");
  header.strokeWeight = 1; header.strokeAlign = "INSIDE";

  var logo = await buildText(section.logoText || "Strawberry Portal", 18, "Bold", TOKENS.colors.textPrimary, "textPrimary", "heading");
  header.appendChild(logo);

  if (section.navItems && section.navItems.length > 0) {
    var nav = figma.createFrame();
    nav.name = "nav-items"; nav.layoutMode = "HORIZONTAL"; nav.itemSpacing = 24;
    nav.counterAxisAlignItems = "CENTER";
    nav.primaryAxisSizingMode = "AUTO"; nav.counterAxisSizingMode = "AUTO"; nav.fills = [];
    for (var ni = 0; ni < section.navItems.length; ni++) {
      var nt = await buildText(section.navItems[ni].label || "", 14, "Regular", TOKENS.colors.textSecondary, "textSecondary", "body");
      nav.appendChild(nt);
    }
    header.appendChild(nav);
  }
  return header;
}

// ============================================================
// Build: Collapsible Section
// ============================================================
async function buildCollapsibleSection(section) {
  var wrapper = figma.createFrame();
  wrapper.name = "Collapsible Section";
  wrapper.layoutMode = "VERTICAL";
  wrapper.primaryAxisSizingMode = "AUTO";
  wrapper.counterAxisSizingMode = "AUTO";
  wrapper.fills = [];

  var divider = figma.createFrame();
  divider.name = "divider"; divider.resize(TOKENS.layout.contentWidth, 1);
  divider.fills = solidFill(TOKENS.colors.borderLight, "borderLight");
  wrapper.appendChild(divider);
  divider.layoutSizingHorizontal = "FILL";

  var toggleRow = figma.createFrame();
  toggleRow.name = "collapse-toggle";
  toggleRow.layoutMode = "HORIZONTAL";
  toggleRow.primaryAxisAlignItems = "SPACE_BETWEEN";
  toggleRow.counterAxisAlignItems = "CENTER";
  toggleRow.primaryAxisSizingMode = "AUTO";
  toggleRow.counterAxisSizingMode = "AUTO";
  toggleRow.paddingTop = toggleRow.paddingBottom = 12;
  toggleRow.fills = [];

  var lbl = await buildText(section.label || "More info", 14, "Medium", TOKENS.colors.textPrimary, "textPrimary", "body");
  toggleRow.appendChild(lbl);
  var chevron = await buildText("▾", 14, "Regular", TOKENS.colors.textSecondary, "textSecondary", "body");
  chevron.name = "chevron";
  toggleRow.appendChild(chevron);

  wrapper.appendChild(toggleRow);
  toggleRow.layoutSizingHorizontal = "FILL";
  return wrapper;
}

async function buildScreen(definition) {
  await loadFonts();
  await discoverVariables();
  await discoverTextStyles();

  var root = figma.createFrame();
  root.name = (definition.meta && definition.meta.component) || "Screen";
  root.layoutMode = "VERTICAL";
  root.itemSpacing = TOKENS.spacing.sm;
  root.primaryAxisSizingMode = "AUTO";
  root.counterAxisSizingMode = "AUTO";
  root.fills = [];

  var sections = definition.sections || [];
  for (var i = 0; i < sections.length; i++) {
    var sec = sections[i];

    if (sec.type === "section-header") {
      var header = await buildText(sec.title, 20, "Bold", TOKENS.colors.textPrimary, "textPrimary", "heading");
      header.name = "Section Header";
      root.appendChild(header);
    }

    if (sec.type === "card-heading-with-action") {
      var headingAction = await buildCardHeadingWithAction(sec);
      root.appendChild(headingAction);
    }

    if (sec.type === "card" && sec.layout === "grid-4col") {
      var card = await buildGridCard(sec);
      root.appendChild(card);
    }

    if (sec.type === "data-table") {
      var table = await buildDataTable(sec);
      root.appendChild(table);
    }

    if (sec.type === "top-stats-card") {
      var topCard = await buildTopStatsCard(sec);
      root.appendChild(topCard);
    }

    if (sec.type === "status-badge") {
      var badge = await buildStatusBadge(sec);
      root.appendChild(badge);
    }

    if (sec.type === "filter-bar") {
      var filterBar = await buildFilterBar(sec);
      root.appendChild(filterBar);
    }

    if (sec.type === "teaser-card") {
      var teaser = await buildTeaserCard(sec);
      root.appendChild(teaser);
    }

    if (sec.type === "sidebar-nav") {
      var sidebarNav = await buildSidebarNav(sec);
      root.appendChild(sidebarNav);
    }

    if (sec.type === "top-header") {
      var topHeader = await buildTopHeader(sec);
      root.appendChild(topHeader);
    }

    if (sec.type === "collapsible-section") {
      var collapsible = await buildCollapsibleSection(sec);
      root.appendChild(collapsible);
    }

    if (sec.type === "primary-action-button") {
      var actionBtn = await buildPrimaryActionButton(sec);
      root.appendChild(actionBtn);
    }

    if (sec.type === "booking-meta") {
      var meta = await buildBookingMeta(sec);
      root.appendChild(meta);
    }
  }

  root.x = Math.round(figma.viewport.center.x - TOKENS.layout.contentWidth / 2);
  root.y = Math.round(figma.viewport.center.y - 100);
  figma.currentPage.appendChild(root);
  figma.viewport.scrollAndZoomIntoView([root]);

  return root;
}

// ============================================================
// Build: Full Page (sidebar + header + content area)
// ============================================================
async function buildFullPage(definition) {
  await loadFonts();
  await discoverVariables();
  await discoverTextStyles();

  var page = definition.page || {};
  var pageWidth = TOKENS.layout.contentWidth + TOKENS.layout.sidebarWidth;
  var pageHeight = 900;

  // Root container (horizontal: sidebar | main)
  var root = figma.createFrame();
  root.name = (definition.meta && definition.meta.component) || "Full Page";
  root.layoutMode = "HORIZONTAL";
  root.primaryAxisSizingMode = "FIXED";
  root.counterAxisSizingMode = "FIXED";
  root.resize(pageWidth, pageHeight);
  root.fills = solidFill(TOKENS.colors.varmGrey, "varmGrey");
  root.clipsContent = true;

  // Sidebar
  if (page.sidebar) {
    var sidebar = await buildSidebarNav(page.sidebar);
    sidebar.resize(TOKENS.layout.sidebarWidth, pageHeight);
    root.appendChild(sidebar);
  }

  // Main area (vertical: header + content)
  var main = figma.createFrame();
  main.name = "main-area";
  main.layoutMode = "VERTICAL";
  main.primaryAxisSizingMode = "FIXED";
  main.counterAxisSizingMode = "FIXED";
  main.resize(TOKENS.layout.contentWidth, pageHeight);
  main.fills = [];

  // Header
  if (page.header) {
    var headerNode = await buildTopHeader(page.header);
    main.appendChild(headerNode);
    headerNode.layoutSizingHorizontal = "FILL";
  }

  // Content scroll area
  var content = figma.createFrame();
  content.name = "content-area";
  content.layoutMode = "VERTICAL";
  content.itemSpacing = 16;
  content.paddingTop = 24;
  content.paddingBottom = 32;
  content.paddingLeft = content.paddingRight = 24;
  content.primaryAxisSizingMode = "AUTO";
  content.counterAxisSizingMode = "AUTO";
  content.fills = [];

  // Back link
  if (page.backLink) {
    var backText = await buildText("← " + page.backLink, 14, "Regular", TOKENS.colors.textLink, "textLink", "body");
    backText.name = "Back Link";
    content.appendChild(backText);
  }

  // Page title
  if (page.title) {
    var titleText = await buildText(page.title, 24, "Bold", TOKENS.colors.textPrimary, "textPrimary", "heading");
    titleText.name = "Page Title";
    content.appendChild(titleText);
  }

  // Content sections
  var contentSections = (page.content && page.content.children) || page.sections || [];
  for (var i = 0; i < contentSections.length; i++) {
    var sec = contentSections[i];
    var built = await buildSectionNode(sec);
    if (built) {
      content.appendChild(built);
      built.layoutSizingHorizontal = "FILL";
    }
  }

  main.appendChild(content);
  content.layoutSizingHorizontal = "FILL";

  root.appendChild(main);

  root.x = Math.round(figma.viewport.center.x - pageWidth / 2);
  root.y = Math.round(figma.viewport.center.y - pageHeight / 2);
  figma.currentPage.appendChild(root);
  figma.viewport.scrollAndZoomIntoView([root]);

  return root;
}

// Helper: build a single section node by type
async function buildSectionNode(sec) {
  if (!sec || !sec.type) return null;

  if (sec.type === "section-header") {
    var h = await buildText(sec.title, 20, "Bold", TOKENS.colors.textPrimary, "textPrimary", "heading");
    h.name = "Section Header";
    return h;
  }
  if (sec.type === "back-link") {
    var bl = await buildText("← " + (sec.text || "Back"), 14, "Regular", TOKENS.colors.textLink, "textLink", "body");
    bl.name = "Back Link";
    return bl;
  }
  if (sec.type === "page-title") {
    var pt = await buildText(sec.text || "Page", 24, "Bold", TOKENS.colors.textPrimary, "textPrimary", "heading");
    pt.name = "Page Title";
    return pt;
  }
  if (sec.type === "card" && sec.layout === "grid-4col") return await buildGridCard(sec);
  if (sec.type === "data-table") return await buildDataTable(sec);
  if (sec.type === "top-stats-card") return await buildTopStatsCard(sec);
  if (sec.type === "status-badge") return await buildStatusBadge(sec);
  if (sec.type === "filter-bar") return await buildFilterBar(sec);
  if (sec.type === "teaser-card") return await buildTeaserCard(sec);
  if (sec.type === "sidebar-nav") return await buildSidebarNav(sec);
  if (sec.type === "top-header") return await buildTopHeader(sec);
  if (sec.type === "collapsible-section") return await buildCollapsibleSection(sec);

  console.log("Unknown section type: " + sec.type);
  return null;
}

// === MAIN: Show UI and listen for messages ===
figma.showUI(__html__, { width: 420, height: 380 });

figma.ui.onmessage = function(msg) {
  if (msg.type === "build") {
    buildScreen(msg.definition).then(function() {
      var sections = msg.definition.sections || [];
      figma.ui.postMessage({ type: "status", text: "Done! Built " + sections.length + " sections.", level: "success" });
    }).catch(function(err) {
      figma.ui.postMessage({ type: "status", text: "Error: " + err.message, level: "error" });
    });
  }
  if (msg.type === "build-page") {
    buildFullPage(msg.definition).then(function() {
      var page = msg.definition.page || {};
      var count = (page.content && page.content.children || page.sections || []).length;
      figma.ui.postMessage({ type: "status", text: "Done! Full page built with " + count + " content sections.", level: "success" });
    }).catch(function(err) {
      figma.ui.postMessage({ type: "status", text: "Error: " + err.message, level: "error" });
    });
  }
};
