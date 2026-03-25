import {siteConfig} from "../../../../constants";
import {CssVariableNames} from "../../../../lib";

export const LeftNavMenu = () => {
    return (
        <div>
            <a href="/" className={`inline-block cursor-pointer select-none flex gap-[10%] justify-center items-center`}>
                <img height={36} width={36} src={siteConfig.logo} />
                <span className={`text-[${CssVariableNames.foregroundColor}]`}>{siteConfig.name}</span>
            </a>
        </div>
    )
}
