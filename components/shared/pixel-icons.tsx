/**
 * The site's icon set: pixelarticons, exported under the lucide names the code
 * already uses. Every shape sits on a pixel grid, so there are no curves and no
 * soft edges. Two icons the set lacks (a star and a diagonal arrow) are drawn here.
 */
import {
  Alert as PxAlert,
  ArrowDown as PxArrowDown,
  ArrowLeft as PxArrowLeft,
  ArrowRight as PxArrowRight,
  ArrowUp as PxArrowUp,
  ArrowUpBox as PxArrowUpBox,
  ArrowsVertical as PxArrowsVertical,
  Article as PxArticle,
  Avatar as PxAvatar,
  Book as PxBook,
  BookOpen as PxBookOpen,
  Briefcase as PxBriefcase,
  Building as PxBuilding,
  Cake as PxCake,
  Calculator as PxCalculator,
  Calendar as PxCalendar,
  CalendarSearch as PxCalendarSearch,
  Chart as PxChart,
  ChartBar as PxChartBar,
  Check as PxCheck,
  CheckDouble as PxCheckDouble,
  Checkbox as PxCheckbox,
  ChevronDown as PxChevronDown,
  ChevronLeft as PxChevronLeft,
  ChevronRight as PxChevronRight,
  ChevronUp as PxChevronUp,
  ChevronsHorizontal as PxChevronsHorizontal,
  ChevronsVertical as PxChevronsVertical,
  Circle as PxCircle,
  Clock as PxClock,
  Close as PxClose,
  Code as PxCode,
  Coin as PxCoin,
  Copy as PxCopy,
  CornerDownLeft as PxCornerDownLeft,
  CreditCard as PxCreditCard,
  Dashboard as PxDashboard,
  Deskphone as PxDeskphone,
  DeviceLaptop as PxDeviceLaptop,
  Dollar as PxDollar,
  Download as PxDownload,
  Edit as PxEdit,
  Eye as PxEye,
  EyeClosed as PxEyeClosed,
  File as PxFile,
  FileAlt as PxFileAlt,
  Folder as PxFolder,
  Gps as PxGps,
  Heart as PxHeart,
  Image as PxImage,
  Inbox as PxInbox,
  InfoBox as PxInfoBox,
  LayoutSidebarLeft as PxLayoutSidebarLeft,
  Lightbulb2 as PxLightbulb2,
  Link as PxLink,
  List as PxList,
  Lock as PxLock,
  Logout as PxLogout,
  Mail as PxMail,
  Menu as PxMenu,
  Minus as PxMinus,
  Monitor as PxMonitor,
  Moon as PxMoon,
  MoreHorizontal as PxMoreHorizontal,
  MoreVertical as PxMoreVertical,
  Notification as PxNotification,
  Plus as PxPlus,
  RadioTower as PxRadioTower,
  Reload as PxReload,
  Reply as PxReply,
  Save as PxSave,
  Search as PxSearch,
  Section as PxSection,
  Server as PxServer,
  Shield as PxShield,
  Sliders as PxSliders,
  Sun as PxSun,
  Teach as PxTeach,
  ToggleRight as PxToggleRight,
  Trash as PxTrash,
  TrendingDown as PxTrendingDown,
  TrendingUp as PxTrendingUp,
  Trophy as PxTrophy,
  User as PxUser,
  UserPlus as PxUserPlus,
  Users as PxUsers,
  Volume2 as PxVolume2,
  WarningBox as PxWarningBox,
  Zap as PxZap,
} from "@nsmr/pixelart-react"

import { PixelBitmap } from "@/components/dither/pixel-icon"
import { cn } from "@/lib/utils"

export type LucideIcon = React.ComponentType<{ className?: string; size?: number | string }>
export type Icon = LucideIcon

type P = { className?: string }

const STAR = [
  "....#....",
  "....#....",
  "...###...",
  "#########",
  ".#######.",
  "..#####..",
  "..##.##..",
  ".##...##.",
  ".#.....#.",
]

export const Star = ({ className }: P) => <PixelBitmap rows={STAR} className={cn("size-6", className)} />
/** Draw a 7x7 bitmap from a set of "x,y" cells. 7 cells at 14px is exactly 2px per cell. */
const grid7 = (cells: string[]): string[] =>
  Array.from({ length: 7 }, (_, y) =>
    Array.from({ length: 7 }, (_, x) => (cells.includes(`${x},${y}`) ? "#" : ".")).join("")
  )

const ARROW_UP_RIGHT = grid7([
  "3,0", "4,0", "5,0", "6,0", "6,1", "6,2", "6,3",
  "5,1", "4,2", "3,3", "2,4", "1,5", "0,6",
])

const EXTERNAL_LINK = grid7([
  "4,0", "5,0", "6,0", "6,1", "6,2", "5,1", "4,2", "3,3",
  "0,1", "1,1", "2,1", "0,2", "0,3", "0,4", "0,5", "0,6",
  "1,6", "2,6", "3,6", "4,6", "5,6", "6,6", "6,5", "6,4",
])

export const ArrowUpRight = ({ className }: P) => <PixelBitmap rows={ARROW_UP_RIGHT} className={cn("size-3.5", className)} />
export const ExternalLink = ({ className }: P) => <PixelBitmap rows={EXTERNAL_LINK} className={cn("size-3.5", className)} />

/** A glyph ramp cycling in place. Ignores `animate-spin`: rotating a pixel icon would blur it. */
export const Loader2 = ({ className }: P) => (
  <span
    role="status"
    aria-label="Loading"
    className={cn(
      "glyph-spinner inline-flex size-6 items-center justify-center font-mono leading-none",
      className?.replace(/\banimate-spin\b/g, "")
    )}
  />
)

export const AlertCircle = PxAlert
export const AlertCircleIcon = PxAlert
export const AlertTriangle = PxWarningBox
export const AlertTriangleIcon = PxWarningBox
export const ArrowDown = PxArrowDown
export const ArrowDownIcon = PxArrowDown
export const ArrowLeft = PxArrowLeft
export const ArrowLeftIcon = PxArrowLeft
export const ArrowRight = PxArrowRight
export const ArrowRightIcon = PxArrowRight
export const ArrowUp = PxArrowUp
export const ArrowUpIcon = PxArrowUp
export const ArrowUpCircle = PxArrowUpBox
export const ArrowUpCircleIcon = PxArrowUpBox
export const ArrowUpDown = PxArrowsVertical
export const ArrowUpDownIcon = PxArrowsVertical
export const BadgeCheck = PxCheckDouble
export const BadgeCheckIcon = PxCheckDouble
export const BarChart = PxChartBar
export const BarChartIcon = PxChartBar
export const Bell = PxNotification
export const BellIcon = PxNotification
export const Book = PxBook
export const BookIcon = PxBook
export const BookImage = PxArticle
export const BookImageIcon = PxArticle
export const BookOpenText = PxBookOpen
export const BookOpenTextIcon = PxBookOpen
export const Brain = PxLightbulb2
export const BrainIcon = PxLightbulb2
export const Briefcase = PxBriefcase
export const BriefcaseIcon = PxBriefcase
export const Calculator = PxCalculator
export const CalculatorIcon = PxCalculator
export const Calendar = PxCalendar
export const CalendarIcon = PxCalendar
export const CalendarSearch = PxCalendarSearch
export const CalendarSearchIcon = PxCalendarSearch
export const Check = PxCheck
export const CheckIcon = PxCheck
export const ChevronDown = PxChevronDown
export const ChevronDownIcon = PxChevronDown
export const ChevronLeft = PxChevronLeft
export const ChevronLeftIcon = PxChevronLeft
export const ChevronRight = PxChevronRight
export const ChevronRightIcon = PxChevronRight
export const ChevronUp = PxChevronUp
export const ChevronUpIcon = PxChevronUp
export const ChevronsRight = PxChevronsHorizontal
export const ChevronsRightIcon = PxChevronsHorizontal
export const ChevronsUpDown = PxChevronsVertical
export const ChevronsUpDownIcon = PxChevronsVertical
export const Circle = PxCircle
export const CircleIcon = PxCircle
export const Clock = PxClock
export const ClockIcon = PxClock
export const Coins = PxCoin
export const CoinsIcon = PxCoin
export const Copy = PxCopy
export const CopyIcon = PxCopy
export const CornerDownLeft = PxCornerDownLeft
export const CornerDownLeftIcon = PxCornerDownLeft
export const CreditCard = PxCreditCard
export const CreditCardIcon = PxCreditCard
export const DatabaseZap = PxServer
export const DatabaseZapIcon = PxServer
export const DollarSign = PxDollar
export const DollarSignIcon = PxDollar
export const Download = PxDownload
export const DownloadIcon = PxDownload
export const ExternalLinkIcon = ExternalLink
export const Eye = PxEye
export const EyeIcon = PxEye
export const EyeOff = PxEyeClosed
export const EyeOffIcon = PxEyeClosed
export const File = PxFile
export const FileIcon = PxFile
export const FileBox = PxFileAlt
export const FileBoxIcon = PxFileAlt
export const FileText = PxArticle
export const FileTextIcon = PxArticle
export const Folder = PxFolder
export const FolderIcon = PxFolder
export const Globe = PxRadioTower
export const GlobeIcon = PxRadioTower
export const GraduationCap = PxTeach
export const GraduationCapIcon = PxTeach
export const GripVertical = PxMoreVertical
export const GripVerticalIcon = PxMoreVertical
export const HelpCircle = PxInfoBox
export const HelpCircleIcon = PxInfoBox
export const Hospital = PxBuilding
export const HospitalIcon = PxBuilding
export const Image = PxImage
export const ImageIcon = PxImage
export const Inbox = PxInbox
export const InboxIcon = PxInbox
export const Laptop = PxDeviceLaptop
export const LaptopIcon = PxDeviceLaptop
export const LayoutDashboard = PxDashboard
export const LayoutDashboardIcon = PxDashboard
export const LineChart = PxChart
export const LineChartIcon = PxChart
export const Link2 = PxLink
export const Link2Icon = PxLink
export const List = PxList
export const ListIcon = PxList
export const Lock = PxLock
export const LockIcon = PxLock
export const LogOut = PxLogout
export const LogOutIcon = PxLogout
export const Mail = PxMail
export const MailIcon = PxMail
export const MapPin = PxGps
export const MapPinIcon = PxGps
export const Mars = PxUser
export const MarsIcon = PxUser
export const Menu = PxMenu
export const MenuIcon = PxMenu
export const Minus = PxMinus
export const MinusIcon = PxMinus
export const Monitor = PxMonitor
export const MonitorIcon = PxMonitor
export const Moon = PxMoon
export const MoonIcon = PxMoon
export const MoreHorizontal = PxMoreHorizontal
export const MoreHorizontalIcon = PxMoreHorizontal
export const MoreVertical = PxMoreVertical
export const MoreVerticalIcon = PxMoreVertical
export const MoveRight = PxArrowRight
export const MoveRightIcon = PxArrowRight
export const PanelLeft = PxLayoutSidebarLeft
export const PanelLeftIcon = PxLayoutSidebarLeft
export const Pencil = PxEdit
export const PencilIcon = PxEdit
export const Phone = PxDeskphone
export const PhoneIcon = PxDeskphone
export const Pizza = PxCake
export const PizzaIcon = PxCake
export const Plus = PxPlus
export const PlusIcon = PxPlus
export const Puzzle = PxSection
export const PuzzleIcon = PxSection
export const RefreshCw = PxReload
export const RefreshCwIcon = PxReload
export const Save = PxSave
export const SaveIcon = PxSave
export const Search = PxSearch
export const SearchIcon = PxSearch
export const Send = PxCornerDownLeft
export const SendIcon = PxCornerDownLeft
export const Settings = PxSliders
export const SettingsIcon = PxSliders
export const Share = PxReply
export const ShareIcon = PxReply
export const Shield = PxShield
export const ShieldIcon = PxShield
export const Sparkles = PxZap
export const SparklesIcon = PxZap
export const Square = PxCheckbox
export const SquareIcon = PxCheckbox
export const SquareTerminal = PxCode
export const SquareTerminalIcon = PxCode
export const Stethoscope = PxHeart
export const StethoscopeIcon = PxHeart
export const SunMedium = PxSun
export const SunMediumIcon = PxSun
export const ToggleRight = PxToggleRight
export const ToggleRightIcon = PxToggleRight
export const Trash = PxTrash
export const TrashIcon = PxTrash
export const TrendingDown = PxTrendingDown
export const TrendingDownIcon = PxTrendingDown
export const TrendingUp = PxTrendingUp
export const TrendingUpIcon = PxTrendingUp
export const Trophy = PxTrophy
export const TrophyIcon = PxTrophy
export const UserCircle = PxAvatar
export const UserCircleIcon = PxAvatar
export const UserCog = PxUser
export const UserCogIcon = PxUser
export const UserPlus = PxUserPlus
export const UserPlusIcon = PxUserPlus
export const Users = PxUsers
export const UsersIcon = PxUsers
export const Volume2 = PxVolume2
export const Volume2Icon = PxVolume2
export const X = PxClose
export const XIcon = PxClose
export const Zap = PxZap
export const ZapIcon = PxZap
export const Loader2Icon = Loader2
export const ArrowUpRightIcon = ArrowUpRight
export const StarIcon = Star
