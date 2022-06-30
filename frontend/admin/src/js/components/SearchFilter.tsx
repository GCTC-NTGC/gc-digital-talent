import React from "react";
import Dialog from "@common/components/Dialog";
import { Button } from "@common/components";
import { FormattedMessage } from "react-intl";

interface SearchFilterFooterProps {
  handleClear: () => void;
  handleSubmit: () => void;
}

const SearchFilterFooter = ({
  handleClear,
  handleSubmit,
}: SearchFilterFooterProps): JSX.Element => (
  <div style={{ display: "flex", placeContent: "space-between" }}>
    <Button type="reset" color="secondary" mode="outline" onClick={handleClear}>
      <FormattedMessage
        description="Reset button within the search filter dialog"
        defaultMessage="Clear filters"
      />
    </Button>
    <Button type="submit" color="cta" onClick={handleSubmit}>
      <FormattedMessage
        description="Submit button within the search filter dialog"
        defaultMessage="Show results"
      />
    </Button>
  </div>
);

interface SearchFilterProps {
  isOpen: boolean;
  onDismiss: (e: React.MouseEvent | React.KeyboardEvent) => void;
}

const SearchFilter = ({
  isOpen,
  onDismiss,
}: SearchFilterProps): JSX.Element => {
  const handleSubmit = () => {};
  const handleClear = () => {};
  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={onDismiss}
      title="Select filters"
      subtitle="Narrow down you table results using the following filters."
      footer={
        <SearchFilterFooter
          handleClear={handleClear}
          handleSubmit={handleSubmit}
        />
      }
    />
  );
};

export default SearchFilter;
