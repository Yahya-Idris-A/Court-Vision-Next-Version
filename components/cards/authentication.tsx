import React from "react";

interface AuthContainerProps {
  authType: string;
  carouselSlot: React.ReactNode;
  formSlot: React.ReactNode;
  authChoiceSlot?: React.ReactNode;
}

const AuthContainer: React.FC<AuthContainerProps> = ({
  authType,
  carouselSlot,
  formSlot,
  authChoiceSlot,
}) => {
  return (
    <>
      <div className="flex flex-row gap-[10px] items-center bg-[var(--CardBackground)] border-1 border-[var(--Border)] shadow rounded-[10px] p-[20px] w-full h-full">
        <div className="h-full w-[40%]">{carouselSlot}</div>
        <div className="flex flex-col gap-[30px] px-[40px] w-[60%]">
          <h1 className="text-[64px] text-[var(--MainText)] font-semibold whitespace-nowrap leading-[24px]">
            {authType}
          </h1>
          {authChoiceSlot}
          {formSlot}
        </div>
      </div>
    </>
  );
};

export default AuthContainer;
