function UploadField({
  setContent,
  setFile,
}: {
  setFile: (file: any) => void;
  setContent: (result: string | ArrayBuffer | null) => void;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    if (target && target.files && target.files.length > 0) {
      const file = target.files[0];
      setFile(file);

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target) {
          const result = event.target.result;
          if (result) {
            setContent(result);
          }
        }
      };
      reader.readAsText(file);
    }
  };
  return (
    <div>
      <input type="file" accept=".xml" onChange={handleFileChange} />
    </div>
  );
}
export default UploadField;
