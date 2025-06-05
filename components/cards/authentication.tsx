import React from "react";

interface AuthContainerProps {
  authType: string;
  formSlot: React.ReactNode;
  authChoiceSlot?: React.ReactNode;
}

const AuthContainer: React.FC<AuthContainerProps> = ({
  authType,
  formSlot,
  authChoiceSlot,
}) => {
  return (
    <>
      <div className="flex flex-col gap-[10px] items-center bg-white stroke-[#DBDADE] shadow px-[10%] xl:px-[25%] py-[25px] w-full">
        <h1 className="text-[30px] md:text-[40px] text-black font-bold px-[90px] py-[10px] whitespace-nowrap">
          {authType}
        </h1>
        {formSlot}
      </div>
      {authChoiceSlot}
    </>
  );
};

export default AuthContainer;
