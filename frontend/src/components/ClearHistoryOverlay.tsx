import React from 'react';
import OverlayComponent from './OverlayComponent';

type Props = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  handleDelete: () => void;
};

const ClearHistoryOverlay = ({
  modalVisible,
  setModalVisible,
  handleDelete,
}: Props): React.ReactElement => {
  const handleClose = () => {
    setModalVisible(false);
  };

  return (
    <OverlayComponent
      modalVisible={modalVisible}
      handleClose={handleClose}
      title="Do you wish to permanently delete your presentation history?"
      description="All successful presentations will be removed."
      leftOption="Cancel"
      handleDelete={handleDelete}
      rightOption="Clear History"
    />
  );
};

export default ClearHistoryOverlay;
