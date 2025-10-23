import { MdAdd, MdApproval, MdOutlineMailOutline } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { FaFacebookF } from "react-icons/fa";
import { IoLogoTiktok } from "react-icons/io5";
import { FaLinkedinIn } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoCallOutline } from "react-icons/io5";
import { AiOutlineYoutube } from "react-icons/ai";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { SiGoogledocs } from "react-icons/si";
import { GoPlus } from "react-icons/go";
import { GrFormNext } from "react-icons/gr";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { GiHospitalCross } from "react-icons/gi";
import { VscFeedback } from "react-icons/vsc";
import { FaUserPlus } from "react-icons/fa6";
import { BiWorld } from "react-icons/bi";
import { LiaAwardSolid } from "react-icons/lia";
import { FaStar } from "react-icons/fa";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { CiSquareMore } from "react-icons/ci";
import { FaGooglePlusG } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { IoLogInOutline } from "react-icons/io5";
import { HiOutlineHome } from "react-icons/hi2";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoPersonCircleSharp } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import { PiUploadSimpleThin } from "react-icons/pi";
import { CiWarning } from "react-icons/ci";
import { IoIosRefresh } from "react-icons/io";
import { GiCircle } from "react-icons/gi";
import { IoTrashOutline } from "react-icons/io5";
import { CiSettings } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { MdOutlineSecurity } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { GiReceiveMoney } from "react-icons/gi";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { CiBank } from "react-icons/ci";
import { GrFormPreviousLink } from "react-icons/gr";
import { IoTimeOutline } from "react-icons/io5";
import { IoWalletOutline } from "react-icons/io5";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaArrowTrendDown } from "react-icons/fa6";
import { IoRefreshCircleSharp } from "react-icons/io5";
import { TbUsersPlus } from "react-icons/tb";
import { BiTransfer } from "react-icons/bi";
import { VscVerified } from "react-icons/vsc";
import { GiGraduateCap } from "react-icons/gi";
import { PiCertificateFill } from "react-icons/pi";
import { FaBusinessTime } from "react-icons/fa6";
import { AiFillFilePdf } from "react-icons/ai";
import { AiOutlineSave } from "react-icons/ai";
import { RiProgress3Line } from "react-icons/ri";
import { FcCancel } from "react-icons/fc";
import { FiMinus } from "react-icons/fi";
import { IoImage } from "react-icons/io5";
import { MdOutlineAttachMoney } from "react-icons/md";
import { MdOutlineMoneyOff } from "react-icons/md";
import { MdOutlineFileDownload } from "react-icons/md";
import { MdFilterList } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { TbCalendarCancel } from "react-icons/tb";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { FaCircle } from "react-icons/fa";
import { IoLanguageSharp } from "react-icons/io5";
import { FaWifi } from "react-icons/fa";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";
import { BsCartX } from "react-icons/bs";
import { GiShoppingCart } from "react-icons/gi";
import { MdAddShoppingCart } from "react-icons/md";
import { BsCreditCard2FrontFill } from "react-icons/bs";
import { CiShop } from "react-icons/ci";
import { RiVipCrown2Line } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { TbCategory2 } from "react-icons/tb";
import { TbBrandBinance } from "react-icons/tb";
import { RiImageAddFill } from "react-icons/ri";
import { IoIosCheckbox } from "react-icons/io";
import { FaUsersCog } from "react-icons/fa";
import { PiHandWithdraw } from "react-icons/pi";
import { FaUserLock } from "react-icons/fa6";

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
}

export const BlockUserIcon = (props: IconProps) => {
  return <FaUserLock {...props} />;
};

export const EmployeeIcon = (props: IconProps) => {
  return <FaUsersCog {...props} />;
};

export const ShopApproveIcon = (props: IconProps) => {
  return <IoIosCheckbox {...props} />;
};

export const BannerIcon = (props: IconProps) => {
  return <RiImageAddFill {...props} />;
};

export const BrandingIcon = (props: IconProps) => {
  return <TbBrandBinance {...props} />;
};

export const CategoryIcon = (props: IconProps) => {
  return <TbCategory2 {...props} />;
};

export const CustomerIcon = (props: IconProps) => {
  return <FaUsers {...props} />;
};

export const VIPIcon = (props: IconProps) => {
  return <RiVipCrown2Line {...props} />;
};
export const ShopIcon = (props: IconProps) => {
  return <CiShop {...props} />;
};
export const CreditCardIcon = (props: IconProps) => {
  return <BsCreditCard2FrontFill {...props} />;
};
export const CartPlusIcon = (props: IconProps) => {
  return <MdAddShoppingCart {...props} />;
};
export const CartIcon = (props: IconProps) => {
  return <GiShoppingCart {...props} />;
};
export const CartCancelIcon = (props: IconProps) => {
  return <BsCartX {...props} />;
};
export const ArrowUpIcon = (props: IconProps) => {
  return <MdKeyboardArrowUp {...props} />;
};
export const ArrowDownIcon = (props: IconProps) => {
  return <MdOutlineKeyboardArrowDown {...props} />;
};
export const WifiIcon = (props: IconProps) => {
  return <FaWifi {...props} />;
};
export const LanguageIcon = (props: IconProps) => {
  return <IoLanguageSharp {...props} />;
};
export const FillCircleIcon = (props: IconProps) => {
  return <FaCircle {...props} />;
};
export const CalendarVerifyIcon = (props: IconProps) => {
  return <FaRegCalendarCheck {...props} />;
};
export const CalendarCancelIcon = (props: IconProps) => {
  return <TbCalendarCancel {...props} />;
};
export const VideoCallIcon = (props: IconProps) => {
  return <IoVideocam {...props} />;
};
export const FilterIcon = (props: IconProps) => {
  return <MdFilterList {...props} />;
};
export const DownloadIcon = (props: IconProps) => {
  return <MdOutlineFileDownload {...props} />;
};
export const DollarOffIcon = (props: IconProps) => {
  return <MdOutlineMoneyOff {...props} />;
};
export const DollarIcon = (props: IconProps) => {
  return <MdOutlineAttachMoney {...props} />;
};
export const ImageIcon = (props: IconProps) => {
  return <IoImage {...props} />;
};
export const MinusIcon = (props: IconProps) => {
  return <FiMinus {...props} />;
};
export const RejectIcon = (props: IconProps) => {
  return <FcCancel {...props} />;
};
export const ProgressIcon = (props: IconProps) => {
  return <RiProgress3Line {...props} />;
};
export const PDFIcon = (props: IconProps) => {
  return <AiFillFilePdf {...props} />;
};
export const ExperienceIcon = (props: IconProps) => {
  return <FaBusinessTime {...props} />;
};
export const ExpertiseIcon = (props: IconProps) => {
  return <PiCertificateFill {...props} />;
};
export const EducationIcon = (props: IconProps) => {
  return <GiGraduateCap {...props} />;
};
export const VerifiedIcon = (props: IconProps) => {
  return <VscVerified {...props} />;
};
export const PatientIcon = (props: IconProps) => {
  return <TbUsersPlus {...props} />;
};
export const PendingIcon = (props: IconProps) => {
  return <IoRefreshCircleSharp {...props} />;
};
export const TrendDownIcon = (props: IconProps) => {
  return <FaArrowTrendDown {...props} />;
};
export const TrendUpIcon = (props: IconProps) => {
  return <FaArrowTrendUp {...props} />;
};
export const WalletIcon = (props: IconProps) => {
  return <IoWalletOutline {...props} />;
};
export const TimeIcon = (props: IconProps) => {
  return <IoTimeOutline {...props} />;
};
export const PreviousLinkIcon = (props: IconProps) => {
  return <GrFormPreviousLink {...props} />;
};
export const BankIcon = (props: IconProps) => {
  return <CiBank {...props} />;
};
export const WithdrawIcon = (props: IconProps) => {
  return <PiHandWithdraw {...props} />;
};
export const DepositIcon = (props: IconProps) => {
  return <GiReceiveMoney {...props} />;
};
export const CheckCircleIcon = (props: IconProps) => {
  return <IoMdCheckmarkCircleOutline {...props} />;
};
export const ProtectIcon = (props: IconProps) => {
  return <MdOutlineSecurity {...props} />;
};
export const EditIcon = (props: IconProps) => {
  return <CiEdit {...props} />;
};
export const SettingIcon = (props: IconProps) => {
  return <CiSettings {...props} />;
};
export const TrashIcon = (props: IconProps) => {
  return <IoTrashOutline {...props} />;
};
export const CircleIcon = (props: IconProps) => {
  return <GiCircle {...props} />;
};
export const WarningIcon = (props: IconProps) => {
  return <CiWarning {...props} />;
};
export const RefreshIcon = (props: IconProps) => {
  return <IoIosRefresh {...props} />;
};
export const UploadIcon = (props: IconProps) => {
  return <PiUploadSimpleThin {...props} />;
};
export const LockIcon = (props: IconProps) => {
  return <CiLock {...props} />;
};
export const LogoutIcon = (props: IconProps) => {
  return <IoLogOutOutline {...props} />;
};
export const CircleUser = (props: IconProps) => {
  return <IoPersonCircleSharp {...props} />;
};
export const OutlineHomeIcon = (props: IconProps) => {
  return <HiOutlineHome {...props} />;
};
export const TransactionIcon = (props: IconProps) => {
  return <BiTransfer {...props} />;
};
export const LoginIcon = (props: IconProps) => {
  return <IoLogInOutline {...props} />;
};
export const BackIcon = (props: IconProps) => {
  return <IoMdArrowBack {...props} />;
};
export const AppleIcon = (props: IconProps) => {
  return <FaApple {...props} />;
};
export const GoogleIcon = (props: IconProps) => {
  return <FaGooglePlusG {...props} />;
};
export const SaveIcon = (props: IconProps) => {
  return <AiOutlineSave {...props} />;
};
export const SquareMoreIcon = (props: IconProps) => {
  return <CiSquareMore {...props} />;
};
export const DoubleCheckIcon = (props: IconProps) => {
  return <IoCheckmarkDoneOutline {...props} />;
};
export const FullStarIcon = (props: IconProps) => {
  return <FaStar {...props} />;
};
export const AwardIcon = (props: IconProps) => {
  return <LiaAwardSolid {...props} />;
};
export const WorldIcon = (props: IconProps) => {
  return <BiWorld {...props} />;
};
export const UserPlusIcon = (props: IconProps) => {
  return <FaUserPlus {...props} />;
};
export const FeedbackIcon = (props: IconProps) => {
  return <VscFeedback {...props} />;
};
export const HospitalIcon = (props: IconProps) => {
  return <GiHospitalCross {...props} />;
};
export const CalendarIcon = (props: IconProps) => {
  return <IoCalendarNumberOutline {...props} />;
};
export const NextIcon = (props: IconProps) => {
  return <GrFormNext {...props} />;
};
export const PlusIcon = (props: IconProps) => {
  return <GoPlus {...props} />;
};
export const HomeIcon = (props: IconProps) => {
  return <FaHome {...props} />;
};
export const DoctorIcon = (props: IconProps) => {
  return <FaUserDoctor {...props} />;
};
export const DocumentIcon = (props: IconProps) => {
  return <SiGoogledocs {...props} />;
};
export const CancelIcon = (props: IconProps) => {
  return <IoClose {...props} />;
};
export const MenuIcon = (props: IconProps) => {
  return <HiMenuAlt2 {...props} />;
};
export const NotiIcon = (props: IconProps) => {
  return <IoIosNotificationsOutline {...props} />;
};
export const CloseEyeIcon = (props: IconProps) => {
  return <IoEyeOutline {...props} />;
};
export const OpenEyeIcon = (props: IconProps) => {
  return <IoEyeOffOutline {...props} />;
};
export const EmailIcon = (props: IconProps) => {
  return <MdOutlineMailOutline {...props} />;
};
export const LocationIcon = (props: IconProps) => {
  return <IoLocationOutline {...props} />;
};
export const FacebookIcon = (props: IconProps) => {
  return <FaFacebookF {...props} />;
};
export const TiktokIcon = (props: IconProps) => {
  return <IoLogoTiktok {...props} />;
};
export const LinkedInIcon = (props: IconProps) => {
  return <FaLinkedinIn {...props} />;
};
export const WhatsappIcon = (props: IconProps) => {
  return <FaWhatsapp {...props} />;
};
export const SearchIcon = (props: IconProps) => {
  return <IoIosSearch {...props} />;
};
export const ArrowNextIcon = (props: IconProps) => {
  return <IoIosArrowRoundForward {...props} />;
};
export const CallIcon = (props: IconProps) => {
  return <IoCallOutline {...props} />;
};
export const YoutubeIcon = (props: IconProps) => {
  return <AiOutlineYoutube {...props} />;
};
export const AddIcon = (props: IconProps) => {
  return <MdAdd {...props} />;
};
export const ApproveIcon = (props: IconProps) => {
  return <MdApproval {...props} />;
};
