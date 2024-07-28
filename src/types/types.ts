interface ImageAsset {
  fileName: string;
  fileSize: number;
  height: number;
  originalPath: string;
  type: string;
  uri: string;
  width: number;
}

interface MultiSelectComponentProps {
  dropdownPlaceholder: string;
  firstDropdownValue: string | null;
  setFirstDropdownValue: React.Dispatch<React.SetStateAction<string>>;
  setFirstDropdownLabel: React.Dispatch<React.SetStateAction<string>>;
  firstInput: string;
  setFirstInput: React.Dispatch<React.SetStateAction<string>>;
  secondInput: string;
  setSecondInput: React.Dispatch<React.SetStateAction<string>>;
  thirdInput: string;
  setThirdInput: React.Dispatch<React.SetStateAction<string>>;
  isParentDropdownOpen: boolean;
  toggleParentDropdown: () => void;
  handleApplyFilter: () => void;
  handleResetFilter: () => void;
  isApplyDisable: boolean;
  dropDownOptions: { label: string; value: string }[];
  firstInputPlaceholder: string;
  secondInputPlaceholder: string;
  thirdInputPlaceholder: string;
}
