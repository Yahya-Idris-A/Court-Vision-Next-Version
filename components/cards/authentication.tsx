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
      <div className="flex flex-row max-xl:flex-col gap-[10px] items-center bg-[var(--CardBackground)] border-1 border-[var(--Border)] shadow rounded-[10px] p-[20px] w-full h-full">
        <div className="h-full w-[40%] max-xl:w-full">{carouselSlot}</div>
        <div className="flex flex-col gap-[30px] max-xl:gap-[10px] px-[40px] max-lg:px-0 w-[60%] max-xl:w-full">
          <h1 className="text-[64px] max-lg:text-[34px] max-xl:text-center text-[var(--MainText)] font-semibold whitespace-nowrap leading-[24px] max-xl:leading-tight">
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
