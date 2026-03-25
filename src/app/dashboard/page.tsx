import {LeftAsideContainer} from "../../components/dashboard/sections/leftAsideContainer.tsx";
import React, {useEffect, useState} from "react";
import {AnimatePresence} from "motion/react";
import {MainDashBoardContainer} from "../../components/dashboard/sections/mainDashBoardContainer.tsx";
import {useAllChatSessionStore} from "../../components/store/useAllChatSessionStore.tsx";

interface DashBoardProps {
    setLoginModelIsOpen: (loginModelIsOpen: boolean) => void;
}
export const DashBoard: React.FC<DashBoardProps> = ({
    setLoginModelIsOpen,
}) => {
    const [showReport, setShowReport] = useState(false);

    const [leftAsideIsExpand, setLeftAsideIsExpand] = useState(false);

    const {queryChatSessionInfoList} = useAllChatSessionStore();

    useEffect(() => {
        queryChatSessionInfoList();
    }, []);

    return (
        <div className="w-full flex relative overflow-hidden">
            <AnimatePresence>
                {leftAsideIsExpand && <LeftAsideContainer setShowReport={setShowReport} leftAsideIsExpand={leftAsideIsExpand} setLeftAsideIsExpand={setLeftAsideIsExpand} />}
            </AnimatePresence>
            <MainDashBoardContainer
                showReport={showReport}
                setShowReport={setShowReport}
                leftAsideIsExpand={leftAsideIsExpand}
                setLeftAsideIsExpand={setLeftAsideIsExpand}
                setLoginModelIsOpen={setLoginModelIsOpen}
            />
        </div>
    )
}
