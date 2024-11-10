import { Social } from "@/components/auth/social"
import { WrapperHeader } from "@/components/auth/wrapper-header"

interface FormWrapperProps {
  children?: React.ReactNode
  headerTitle: string
  headerSubtitle?: string
  showSocial?: boolean
}

export function FormWrapper({
  children,
  headerTitle,
  headerSubtitle,
  showSocial,
}: FormWrapperProps) {
  return (
    <div className="flex flex-col items-center w-full sm:max-w-[480px] py-6 rounded-xl xs:shadow-2xl xs:border my-4">
      <WrapperHeader title={headerTitle} subtitle={headerSubtitle} />

      <div className="w-full mt-3">{children}</div>

      <div className="w-full">{showSocial && <Social />}</div>
    </div>
  )
}