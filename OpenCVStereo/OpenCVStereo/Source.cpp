#include "opencv2/opencv.hpp"
#include "opencv2/imgcodecs/imgcodecs.hpp"
#include "opencv2/videoio/videoio.hpp"

using namespace cv;

int main(int, char**)
{
	
	VideoCapture cap("C:/Users/Sam/Desktop/OpenCVSampleVid/hippo.mp4"); // open the default camera REPLACE WITH FILE NAME
	if (!cap.isOpened())  // check if we succeeded
		return -1;
	VideoCapture cap1("C:/Users/Sam/Desktop/OpenCVSampleVid/hippo.mp4"); // open the default camera REPLACE WITH FILE NAME
	if (!cap.isOpened())  // check if we succeeded
		return -1;
	//VideoWriter Params
	int ex = static_cast<int>(cap.get(CV_CAP_PROP_FOURCC));
	String name = "C:/Users/Sam/Desktop/OpenCVSampleVid/Combined.mp4";
	double fps = cap.get(CV_CAP_PROP_FPS);
	Size outputSize = Size((int)2 * cap.get(CV_CAP_PROP_FRAME_WIDTH), cap.get(CV_CAP_PROP_FRAME_HEIGHT));
	
	Mat combined;
	//VideoWrite code currently Broken
	VideoWriter SBS;
	SBS.open(name, -1, fps, outputSize, true);//Currently Having trouble with 2nd parameter , Codec (file type)
	if (!SBS.isOpened())
		return -1;
	namedWindow("SBS", WINDOW_AUTOSIZE);
	for (;;)
	{
		Mat frame;             
		Mat frame1;
		
		cap >> frame; // get a new frame from camera
		cap1 >> frame1;
		if (frame.empty() || frame1.empty()) {
			break;
		}
		else {
			hconcat(frame, frame1, combined);

			imshow("SBS", combined);
			SBS.write(combined);
			waitKey(0);
			//if (waitKey(30) >= 0) break;
		}
	}
	
	// the camera will be deinitialized automatically in VideoCapture destructor
	return 0;
}
