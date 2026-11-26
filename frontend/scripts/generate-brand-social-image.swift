import AppKit
import Foundation

// Deterministic social card made from the project's original brand artwork.
let root = URL(fileURLWithPath: #filePath).deletingLastPathComponent().deletingLastPathComponent()
let output = root.appendingPathComponent("public/og-brand-sand.jpg")
let logo = NSImage(contentsOf: root.appendingPathComponent("src/assets/grup-xaluca-logo.webp"))!
let monogram = NSImage(contentsOf: root.appendingPathComponent("src/assets/monograma-x-crop.png"))!
let tintedMonogram = NSImage(size: monogram.size)
tintedMonogram.lockFocus()
monogram.draw(in: NSRect(origin: .zero, size: monogram.size))
NSGraphicsContext.current?.compositingOperation = .sourceIn
NSColor(calibratedRed: 0.67, green: 0.36, blue: 0.19, alpha: 1).setFill()
NSRect(origin: .zero, size: monogram.size).fill()
tintedMonogram.unlockFocus()
let size = NSSize(width: 1200, height: 630)
let image = NSImage(size: size, flipped: false) { bounds in
    NSColor(calibratedRed: 0.95, green: 0.91, blue: 0.83, alpha: 1).setFill()
    bounds.fill()

    logo.draw(in: NSRect(x: 430, y: 145, width: 340, height: 340),
              from: .zero, operation: .sourceOver, fraction: 1)
    tintedMonogram.draw(in: NSRect(x: 980, y: -135, width: 250, height: 720),
                        from: .zero, operation: .sourceOver, fraction: 0.75)
    return true
}
let bitmap = NSBitmapImageRep(data: image.tiffRepresentation!)!
let jpeg = bitmap.representation(using: .jpeg, properties: [.compressionFactor: 0.9])!
try jpeg.write(to: output, options: .atomic)
print("Generated \(output.path) (1200×630)")
