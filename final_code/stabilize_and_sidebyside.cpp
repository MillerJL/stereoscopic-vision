#include <stdio.h>
#include <stdlib.h>
#include <string.h>



int main(int, char**)
{
    //.........................................................................
    // NAME VIDEOS VIDEO1 AND VIDEO2. OUTPUT VIDEO WILL BE NAMED finalVideo.mp4
    //.........................................................................
    // stabilizing video 1
    system("ffmpeg -i video1.mp4 -vf vidstabdetect=stepsize=6:shakiness=8:accuracy=9:result=transform_vectors.trf -f null -");
    system("ffmpeg -i video1.mp4 -vf vidstabtransform=input=transform_vectors.trf:zoom=1:smoothing=30,unsharp=5:5:0.8:3:3:0.4 -vcodec libx264 -preset slow -tune film -crf 18 -acodec copy smoothedVideo1.mp4");
    
    // stabilizing video2
    
    system("ffmpeg -i video2.mp4 -vf vidstabdetect=stepsize=6:shakiness=8:accuracy=9:result=transform_vectors.trf -f null -");
    system("ffmpeg -i video2.mp4 -vf vidstabtransform=input=transform_vectors.trf:zoom=1:smoothing=30,unsharp=5:5:0.8:3:3:0.4 -vcodec libx264 -preset slow -tune film -crf 18 -acodec copy smoothedVideo2.mp4");
    

	// side by side conversion
    system("ffmpeg -i smoothedVideo1.mp4 -i smoothedVideo2.mp4 -filter_complex \"[0:v:0]pad=iw*2:ih[bg]; [bg][1:v:0]overlay=w\" finalVideo.mp4");
    
}