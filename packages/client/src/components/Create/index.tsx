import Registry from '../Registry';

export default function Create() {
  const handleModal = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.getElementById('create-tokenbound-modal ').showModal();
  };

  return (
    <div>
      <div
        onClick={() => handleModal()}
        className='h-48 w-40 font-bold border-2 border-gray-500 cursor-pointer bg-gray-600 rounded-lg flex justify-center items-center'
      >
        Custom create
      </div>
      <dialog id='create-tokenbound-modal ' className='modal'>
        <div className='modal-box text-black w-11/12 max-w-5xl'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              ✕
            </button>
          </form>
          <h3 className='font-bold text-lg'>Create</h3>
          <div className='grid grid-col-3 gap-4'>
            <Registry />
          </div>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
