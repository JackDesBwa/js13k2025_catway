# Postmortem

## Context

This game was written for js13k jam, a coding competition online for web game
developers, with a 13KB size limit. The theme was `Black Cat`. I applied for the
category WebXR in which an additional external library, provided by the website
of the contest, can be used to simplify XR and 3D management. In the list, I
chose A-FRAME, mainly because the challenge was a pretext for me to learn how to
use this framework and see if it could be useful in the context of another
project I have in mind. It was a single person project and the first time I
participated in this challenge.

## Idea

My initial idea was to create a minimalist puzzle game where the player has to
guide the cat to find its goal, a nice cozy pillow on which to sleep. The
universe was imagined to be a set of cubes floating in front of the VR player
in 3D, in which the cat could move from cube to cube like on little planets that
kept it oriented around them. I imagined the ability to jump from cube to cube,
and change direction once during the jump to go toward another planet for adding
some dynamism.

After understanding enough of A-FRAME, I made a proof of concept of this idea
with a simple world and simplified mechanics. When I drew the graph of all
possible movements, I realized how boring it would be as those initial rules
allowed to go everywhere too easily. It demotivated me so much! Thankfully, I
realized a little after that adding empty faces well placed could create
one-ways in this graph, leaving room for interesting puzzles.

The final idea kept the concept of being attracted to cubes and of a small
world before our eyes in WebXR, removed the mid-air change of direction, and
added empty and poisonous tiles allowing to shape the graph of movements to
some extent.

## Rewriting

While learning and experimenting, the code became a big mess of spaghetti.
I rewrote the whole game from scratch, taking into account the lessons I learned
during the previous phase. I am still not completely happy with the new
organization of the files, but it is far better and it was the occasion to
clean-up the code.

## HD images

To have nice high definition graphics despite the small space available, I chose
to draw SVG images with simple shapes, which was a good choice. The direct
export was already quite small, but I managed to reduce their size even further
by using the tool `scour` to easily make simplifications in their code, by
inspecting the code and cleaning manually a bit more and also by modifying the
paths in the images to reduce their complexity.

At some point, I had the happy idea to use a (SVG) texture for the tiles. It
costed a relative lot of bytes, but the improvement in the visual aspect was so
good that it was worth it. The previous design was already nice, but the
textured one added a subtle touch that made the visual significantly better.

## Starry sky

The texture of the starry sky is generated randomly with a canvas, and tiled
onto the inside of a low-poly sphere. The challenge is that this element has to
be handled differently depending on the 3D mode used in the game.

In most modes, the sky is attached to the camera, so that moving around the
level does not make the stars move in the background. In VR, the sky is
attached to the scene itself, so that the player do not become nauseous with a
sky that moves when the head turns. In AR, the sky is detached completely, so
that the environment is visible and the 3D objects float in the room.

## Orbit control

I was very surprised to notice that no orbit control is built-in in A-FRAME
given the very usual use case in 3D. Thus I had to code one myself.

I initially started with quaternion relative movements in order to avoid the
gimbal lock limitation of Euler angles. I had to learn how quaternions worked
and experiment a bit, but I managed to code it. Unfortunately, the result felt
unnatural when the world switched upside down. So I came back to more
traditional gimbal-like control. The good news is that I learned a bit about
quaternions and was able to use them correctly.

I also coded a way to change the field of view of the camera with mouse wheel
and minimalist code to simulate pinch gesture with touchscreen.

## Interaction

The game takes advantage of the `cursor` and `laser-controls` components of
A-FRAME which allow to interact with objects in the scene. In particular, the
faces of the cubes react to `mouseenter` and `mouseleave` events to highlight
when the cursor or the lasers linked to the XR controllers could click on them,
and to `click` events to inform the game engine that the player wants to move
the cat on them.

I initially used the faces to give an XYZ direction, but adding the position of
the face and treating it as a destination made more intuitive controls.

I would have liked to add hand controllers in XR too, but the device I used to
test did not look consistent on its support in the game, detecting my hands
sometimes, and sometimes not with the same code. I then abandoned the idea to
support this way of interacting, not having enough time to debug this behavior.

Another interaction that crossed my mind but was not implemented because of
limited time is a cursor controlled by the gaze direction only when no
controller is connected. I saw that A-FRAME has built-in code to support it, but
I did not dive into it.

There is also a way to orient the scene to see it from another angle, either by
moving the camera with drag events on the canvas or by moving the small world
itself by grabbing in XR.

In addition, there are some inputs with keyboard, gamepad and XR controllers
buttons that will be discussed later.

## Stereoscopic effects

This was a big part and a personal challenge. My reached goal was to allow the
game to be displayed on a large variety of devices able to display 3D. I already
wrote a library for THREE.js in the past, and was in the process of refactoring
it to reduce its size.

Interfacing this library with A-FRAME was not straightforward. In particular,
the code needs to take control of the rendering to apply the formatting of the
output and it was obviously not possible to modify the library to use my
renderer.

The hack that made it possible is quite simple in the end. It uses the dynamic
behavior of javascript to monkey-patch the renderer object used by A-FRAME: the
`render` and `setSize` methods of the renderer are replaced by mine, that adds
its behavior before or after calling the original. That way A-FRAME still call
the renderer without modification, and my code is run at those occasions.

The mouse and touchscreen interaction required to add code on top of this
drawing library. Here again, I used monkey-patching to change the behavior of
a built-in component. I patched the `onMouseMove` method of the `cursor`
component, by pre-processing and altering the argument depending of the 3D mode
selected. For example, when the screen is split in two parts like in anamorphic
parallel display used by most 3D TV sets, the coordinates of the event are
changed to correspond to the coordinate on the canvas after the TV has
transformed the image to display it.

It is not a perfect process, because the raycasting is done with the original
camera, and not the added camera for each eye. Therefore, the coordinates are a
bit off, but the objects in the game are sufficiently large or sufficiently
close to the focal point and all interactions have visual feedback, so that it
is not a problem in practice.

Ideally, I would have removed the native cursor and replace it with an element
moving in the 3D world. It would have given a nice feedback, avoided retinal
rivalries introduced by the native cursor, and masked the inaccuracy of the
raycasting from the wrong camera. I did not spend the time to add this in this
time constrained project though.

## Vite plugins for levels and tips

I learned to write plugins for `vite`, the tool I used to bundle the project. In
particular I created plugins that add two virtual files that can be imported by
the javascript code, which aggregates the content of several files, that are in
addition watched by the dev server to reload the code.

This allows to import `levels.json` and `tips.json` which do not exist, but are
created in memory when requested. Those file are fusing the content of
`level_*.json` and `tips_*.json`, allowing to separate the content in a more
readable manner.

In particular, each level can be split in its own file, and seen by the code as
one big array of levels. For tips, the formatting is different, but the principle
is the same.

## Animations

I used animations to give some visual dynamism to the game. In particular, the
cat and the pillow are oscillating playfully, and the opacity of the faces
varies with a breathing animation.

Those animations play also a small role in the game itself. The oscillating
elements help to spot were the current position and the goal are placed, and the
varying opacity helps to see the cubes behind the closest ones.

I also added an animation on win/loose to emphasize those situations.

Finally, I added animations when the different pages of the game open. It was
initially imagined for the playing page, so that the world appears before our
eyes, with a very interesting effect in AR when the cube arrive in your living
room. I reused the animations on other pages.

Maybe I could have added some animation on exiting too, although it feels okay
that way already. I wonder if it would have looked nice or overwhelming.

One challenge was to manage conflicting animations. In the end, it was easily
solved by using triggers, like waiting for the entering animation to finish
before starting the breathing, or starting the oscillation on load and after the
loosing animation overriding it is finished.

## Sound FX & music

This is the part which gave me the most troubles. I learned the surface of audio
generation in browser using `AudioContext` subsystem, and built a mini sequencer
of notes with their associated simple envelope.

The sound effects are simple rapid sequences of notes, and the music is simply
notes picked randomly in a set of notes that sound well with the others, at slow
tempo to give a peaceful atmosphere allowing to think about the puzzle.

There was an annoying bug that was hard to track because I was not able to
reproduce it systematically: the music did not always stop. I changed the way to
play the note in loop and the bug was still there. I read and read again and saw
no logic error. Just before submitting, I realized that on some occasion it was
started a second time with no way to stop the first loop and then I was able to
fix it just in time.

## Inputs

In addition to mouse/touch and laser controllers, I added some inputs to play
the game: keyboard, gamepad, XR controller's buttons. All those systems allow to
set a direction and choose to walk or jump. They can be used together, for
example giving the direction with a joystick and the action with the keyboard.

Unfortunately, the game still needs a mouse or touchscreen to navigate the
menus, although ultra basic navigation with the jump action was added: pressing
the jump button in the menus ultimately lead to play the higher level available.

Having the ability to fully control the game with those inputs could be a nice
addition.

## Levels

I designed the 6 first levels to progressively introduce the mechanics of the
game, in order to guide the player. There are also some tips bubbles to guide
them further.

The 7th is a rather simple challenge. The next one was initially a more complex
puzzle, but the gap in difficulty could have been discouraging. Since I had some
space in the end, I added two other less overwhelming levels in between.

The last one is just to say goodbye with a tip bubble.

## Edit helper

To edit levels, I added a ugly builder helper that is available in dev mode
only. It is a single page with scripts, allowing to generate and edit the JSON
whose result is previewed on the right. A highlighted tile helps to show which
cube or face is about to be changed. Rudimentary, but helpful.

## The zero bytes left paradox

Just before submitting, the ZIP was exactly on the size limit. However, inside
the game, there was a message saying that the limit is almost reached. The
paradox was that changing this message to say that the game reached the limit,
reduced the size of the bundle, making this new message wrong.

Fortunately, I found a solution: saying that it remains only 1 byte left,
removed one character (the s of plural), that made the ZIP exactly one byte
less, allowing the message to be true.

## Final words

The experience of creating the game was a big source of learning.

The game by itself is pretty nice, and although I identified some improvements,
I doubt I would work on them. However, I'm open to pull requests from other
people if they liked the game.

I am a bit unhappy to not have been able to implement hands support in XR, and I
do not like the way the code is organized much, but overall it is a nice
project and I'm happy with the result.

Concerning A-FRAME, it is a nice library, but that won't fit with my other
project. However there are several good ideas from it that I will definitely
reuse in my future work.

I might participate in the contest in a future edition, it was a fun experience.
